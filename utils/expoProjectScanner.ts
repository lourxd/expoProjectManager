import * as FileSystem from 'expo-file-system';

export interface ScanProgress {
  currentPath: string;
  foundCount: number;
}

export type ProgressCallback = (progress: ScanProgress) => void;

const SKIP_DIRECTORIES = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  'Pods',
  'Library',
  'Applications',
  'System',
  '.Trash',
  'ios',
  'android',
  'macos',
  '.expo',
  'coverage',
  '.next',
  '.cache',
]);

const MAX_CONCURRENT_SCANS = 10;
const MAX_DEPTH = 4;

/**
 * Check if a directory is an Expo project
 */
async function isExpoProject(dirPath: string): Promise<boolean> {
  try {
    const contents = await FileSystem.readDirectoryAsync(dirPath);

    // Quick checks first
    const hasAppJson = contents.includes('app.json');
    const hasAppConfig =
      contents.includes('app.config.js') || contents.includes('app.config.ts');

    if (!hasAppJson && !hasAppConfig) {
      return false;
    }

    // Check package.json for expo dependency
    if (contents.includes('package.json')) {
      const packageJsonPath = `${dirPath}/package.json`;
      const packageJsonContent = await FileSystem.readAsStringAsync(
        packageJsonPath
      );
      const packageJson = JSON.parse(packageJsonContent);
      const hasExpoDep =
        packageJson.dependencies?.expo || packageJson.devDependencies?.expo;

      return !!(hasAppJson || hasAppConfig) && !!hasExpoDep;
    }

    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Scan a single directory and return subdirectories to scan
 */
async function scanDirectory(
  dirPath: string,
  foundProjects: string[],
  currentDepth: number,
  onProgress?: ProgressCallback
): Promise<string[]> {
  if (currentDepth >= MAX_DEPTH) {
    return [];
  }

  try {
    // Update progress
    if (onProgress) {
      onProgress({
        currentPath: dirPath,
        foundCount: foundProjects.length,
      });
    }

    const contents = await FileSystem.readDirectoryAsync(dirPath);

    // Check if current directory is an Expo project
    if (await isExpoProject(dirPath)) {
      console.log(`✓ Found Expo project: ${dirPath}`);
      foundProjects.push(dirPath);
      return []; // Don't scan nested projects
    }

    // Collect subdirectories to scan
    const subdirs: string[] = [];

    // Use Promise.all for concurrent file info checks
    const itemChecks = contents
      .filter(item => !item.startsWith('.') && !SKIP_DIRECTORIES.has(item))
      .map(async item => {
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
  foundProjects: string[],
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
): Promise<string[]> {
  console.log('🔍 Starting Expo project scan...');
  console.log(`📁 Search paths: ${searchPaths.length}`);

  const foundProjects: string[] = [];
  const validPaths: string[] = [];

  // Check which paths exist
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

  console.log(`✅ Scan complete! Found ${foundProjects.length} Expo projects`);
  return foundProjects;
}

/**
 * Get default search paths for the current user
 */
export function getDefaultSearchPaths(username: string): string[] {
  const homeDir = `file:///Users/${username}`;

  return [
    `${homeDir}/Documents`,
    `${homeDir}/Desktop`,
    `${homeDir}/Developer`,
    `${homeDir}/Projects`,
    `${homeDir}/Code`,
    `${homeDir}/Development`,
  ];
}
