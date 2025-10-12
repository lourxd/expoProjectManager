import * as FileSystem from 'expo-file-system';
import type {InsertProject} from '../db/schema/project';

export interface ScanProgress {
  currentPath: string;
  foundCount: number;
  type: 'scanning' | 'found' | 'skipped' | 'processing';
  message?: string;
}

export type ProjectMetadata = Omit<InsertProject, 'id' | 'createdAt' | 'updatedAt'>;

export type ProgressCallback = (progress: ScanProgress) => void;

const SKIP_DIRECTORIES = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  'out',
  'Pods',
  'Library',
  'Applications',
  'System',
  '.Trash',
  'ios',
  'android',
  'macos',
  'windows',
  '.expo',
  'coverage',
  '.next',
  '.cache',
  '.vscode',
  '.idea',
  '__pycache__',
  'venv',
  'env',
  '.gradle',
  'target',
]);

const MAX_CONCURRENT_SCANS = 20;
const MAX_DEPTH = 6;

/**
 * Extract project metadata from app.json and package.json
 */
async function extractProjectMetadata(dirPath: string): Promise<ProjectMetadata> {
  const folderName = dirPath.split('/').pop() || 'Unknown Project';

  const metadata: ProjectMetadata = {
    path: dirPath.replace('file://', ''),
    folderName,
  };

  try {
    // Read app.json for icon, name, version, SDK version
    const appJsonPath = `${dirPath}/app.json`;
    const appJsonInfo = await FileSystem.getInfoAsync(appJsonPath);

    if (appJsonInfo.exists) {
      const appJsonContent = await FileSystem.readAsStringAsync(appJsonPath);
      const appJson = JSON.parse(appJsonContent);

      // Extract name (can be at root or in expo object)
      metadata.name = appJson.name || appJson.expo?.name;

      // Extract slug
      metadata.slug = appJson.slug || appJson.expo?.slug;

      // Extract scheme
      metadata.scheme = appJson.scheme || appJson.expo?.scheme;

      // Extract version
      metadata.version = appJson.version || appJson.expo?.version;

      // Extract SDK version
      metadata.sdkVersion = appJson.sdkVersion || appJson.expo?.sdkVersion;

      // Extract newArchEnabled flag
      metadata.usesNewArch = appJson.newArchEnabled || appJson.expo?.newArchEnabled;

      // Extract icon path
      const iconRelativePath = appJson.icon || appJson.expo?.icon;
      if (iconRelativePath) {
        metadata.iconPath = `${dirPath}/${iconRelativePath}`.replace('file://', '');
      }
    }

    // Read package.json for version and expo version if not found
    const packageJsonPath = `${dirPath}/package.json`;
    const packageJsonInfo = await FileSystem.getInfoAsync(packageJsonPath);

    if (packageJsonInfo.exists) {
      const packageJsonContent = await FileSystem.readAsStringAsync(packageJsonPath);
      const packageJson = JSON.parse(packageJsonContent);

      // Use package.json version if app.json version not found
      if (!metadata.version) {
        metadata.version = packageJson.version;
      }

      // Extract SDK version from expo dependency
      if (!metadata.sdkVersion) {
        const expoVersion = packageJson.dependencies?.expo || packageJson.devDependencies?.expo;
        if (expoVersion) {
          metadata.sdkVersion = expoVersion.replace(/[\^~]/, '');
        }
      }
    }

    // Skip size calculation for speed - can be added later if needed
    // metadata.size = await calculateDirectorySize(dirPath);

  } catch (error) {
    console.error(`Error extracting metadata for ${dirPath}:`, error);
  }

  return metadata;
}

/**
 * Check if a directory is a project and what type
 * Returns: 'expo' | 'other' | 'none'
 * Optimized with early exits to minimize I/O
 */
async function checkProjectType(dirPath: string): Promise<'expo' | 'other' | 'none'> {
  try {
    // Fast check: does package.json exist?
    const packageJsonPath = `${dirPath}/package.json`;
    const packageJsonInfo = await FileSystem.getInfoAsync(packageJsonPath);

    if (!packageJsonInfo.exists) {
      return 'none'; // Not a project at all - fastest path
    }

    // Read package.json once
    const packageJsonContent = await FileSystem.readAsStringAsync(packageJsonPath);
    const packageJson = JSON.parse(packageJsonContent);

    const hasExpoDep = packageJson.dependencies?.expo || packageJson.devDependencies?.expo;

    // If no expo dependency, it's another framework - skip it
    if (!hasExpoDep) {
      return 'other';
    }

    // Has expo, now check for app.json or app.config (fast parallel check)
    const [appJsonInfo, appConfigJsInfo, appConfigTsInfo] = await Promise.all([
      FileSystem.getInfoAsync(`${dirPath}/app.json`),
      FileSystem.getInfoAsync(`${dirPath}/app.config.js`),
      FileSystem.getInfoAsync(`${dirPath}/app.config.ts`),
    ]);

    const hasAppConfig = appJsonInfo.exists || appConfigJsInfo.exists || appConfigTsInfo.exists;

    return hasAppConfig ? 'expo' : 'other';
  } catch (error) {
    return 'none';
  }
}

/**
 * Scan a single directory and return subdirectories to scan
 */
async function scanDirectory(
  dirPath: string,
  foundProjects: ProjectMetadata[],
  currentDepth: number,
  onProgress?: ProgressCallback
): Promise<string[]> {
  if (currentDepth >= MAX_DEPTH) {
    return [];
  }

  try {
    // Update progress - scanning
    if (onProgress) {
      onProgress({
        currentPath: dirPath,
        foundCount: foundProjects.length,
        type: 'scanning',
        message: 'Checking directory...',
      });
    }

    // Check what type of project this is
    const projectType = await checkProjectType(dirPath);

    // If it's an Expo project, add it and don't scan subdirectories
    if (projectType === 'expo') {
      const projectName = dirPath.split('/').pop() || 'Unknown';
      console.log(`✓ Found Expo project: ${dirPath}`);

      if (onProgress) {
        onProgress({
          currentPath: dirPath,
          foundCount: foundProjects.length,
          type: 'found',
          message: `Found Expo project: ${projectName}`,
        });
      }

      const metadata = await extractProjectMetadata(dirPath);
      foundProjects.push(metadata);
      return []; // Don't scan inside Expo projects
    }

    // If it's another framework's project, skip it entirely
    if (projectType === 'other') {
      const projectName = dirPath.split('/').pop() || 'Unknown';
      console.log(`⊘ Skipping non-Expo project: ${dirPath}`);

      if (onProgress) {
        onProgress({
          currentPath: dirPath,
          foundCount: foundProjects.length,
          type: 'skipped',
          message: `Skipped non-Expo project: ${projectName}`,
        });
      }

      return []; // Don't scan inside other projects
    }

    // If it's not a project (projectType === 'none'), scan subdirectories
    const contents = await FileSystem.readDirectoryAsync(dirPath);

    // Filter out obviously non-project directories before checking
    const filteredContents = contents.filter(item => {
      // Skip hidden files and known skip directories
      if (item.startsWith('.') || SKIP_DIRECTORIES.has(item)) {
        return false;
      }

      // Skip common non-project folders by name pattern
      const lowerItem = item.toLowerCase();
      if (
        lowerItem.includes('backup') ||
        lowerItem.includes('archive') ||
        lowerItem.includes('temp') ||
        lowerItem.includes('cache') ||
        lowerItem === 'downloads' ||
        lowerItem === 'pictures' ||
        lowerItem === 'music' ||
        lowerItem === 'movies' ||
        lowerItem === 'public'
      ) {
        return false;
      }

      return true;
    });

    // Batch process subdirectories
    const subdirs: string[] = [];
    const batchSize = 10;

    for (let i = 0; i < filteredContents.length; i += batchSize) {
      const batch = filteredContents.slice(i, i + batchSize);
      const itemChecks = batch.map(async item => {
        const itemPath = `${dirPath}/${item}`;
        try {
          const info = await FileSystem.getInfoAsync(itemPath);
          if (info.exists && info.isDirectory) {
            return itemPath;
          }
        } catch {
          // Skip inaccessible items
        }
        return null;
      });

      const results = await Promise.all(itemChecks);
      subdirs.push(...results.filter((path): path is string => path !== null));
    }

    return subdirs;
  } catch (error) {
    // Silently skip directories we can't access
    return [];
  }
}

/**
 * Scan directories with controlled concurrency
 */
async function scanWithConcurrency(
  directories: string[],
  foundProjects: ProjectMetadata[],
  currentDepth: number,
  onProgress?: ProgressCallback
): Promise<void> {
  if (directories.length === 0 || currentDepth >= MAX_DEPTH) {
    return;
  }

  const queue = [...directories];
  const active: Promise<string[]>[] = [];
  const nextDirs: string[] = [];

  while (queue.length > 0 || active.length > 0) {
    // Fill up to MAX_CONCURRENT_SCANS
    while (active.length < MAX_CONCURRENT_SCANS && queue.length > 0) {
      const dir = queue.shift()!;
      active.push(scanDirectory(dir, foundProjects, currentDepth, onProgress));
    }

    // Wait for at least one to complete
    if (active.length > 0) {
      const result = await Promise.race(active);
      const index = active.findIndex(async p => (await p) === result);
      active.splice(index, 1);
      nextDirs.push(...result);
    }
  }

  // Recursively scan next level
  if (nextDirs.length > 0) {
    await scanWithConcurrency(
      nextDirs,
      foundProjects,
      currentDepth + 1,
      onProgress
    );
  }
}

/**
 * Scan for Expo projects in specified paths
 */
export async function scanForExpoProjects(
  searchPaths: string[],
  onProgress?: ProgressCallback
): Promise<ProjectMetadata[]> {
  const startTime = Date.now();
  console.log('🔍 Starting Expo project scan...');
  console.log(`📁 Search paths: ${searchPaths.length}`);

  const foundProjects: ProjectMetadata[] = [];
  const validPaths: string[] = [];

  // Check which paths exist (in parallel)
  console.log('⏱️  Validating search paths...');
  const pathChecks = searchPaths.map(async path => {
    try {
      const info = await FileSystem.getInfoAsync(path);
      if (info.exists && info.isDirectory) {
        return path;
      }
    } catch {
      // Skip invalid paths
    }
    return null;
  });

  const pathResults = await Promise.all(pathChecks);
  validPaths.push(...pathResults.filter((p): p is string => p !== null));

  console.log(`✓ Valid paths: ${validPaths.length}`);

  // Scan all paths with concurrency
  await scanWithConcurrency(validPaths, foundProjects, 0, onProgress);

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`✅ Scan complete! Found ${foundProjects.length} Expo projects in ${duration}s`);
  return foundProjects;
}

/**
 * Get default search paths for the current user
 * Prioritized by likelihood of containing Expo projects
 */
export function getDefaultSearchPaths(username: string): string[] {
  const homeDir = `file:///Users/${username}`;

  return [
    `${homeDir}/Developer`,
    `${homeDir}/Projects`,
    `${homeDir}/Code`,
    `${homeDir}/Development`,
    `${homeDir}/Documents`,
    `${homeDir}/Desktop`,
  ];
}
