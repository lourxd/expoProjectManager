import {NativeModules, NativeEventEmitter} from 'react-native';

export interface ScannedProject {
  folderName: string;
  path: string;
  name?: string;
  slug?: string;
  scheme?: string;
  version?: string;
  sdkVersion?: string;
  usesNewArch?: boolean;
  iconPath?: string;
  folderSize?: string;
  projectSize?: string;
  dependencies?: string;
  devDependencies?: string;
  // App.json / Expo config fields
  orientation?: string;
  platforms?: string;
  backgroundColor?: string;
  primaryColor?: string;
  bundleIdentifier?: string;
  androidPackage?: string;
  permissions?: string;
  splash?: string;
  updates?: string;
  plugins?: string;
  extra?: string;
}

export interface ScanProgress {
  type: 'scanning' | 'found' | 'skipped';
  message: string;
  currentPath: string;
}

export interface ScanResult {
  cancelled: boolean;
  completed: boolean;
}

export interface ProjectScannerModule {
  scanFolder(folderPath: string): Promise<ScanResult>;
  cancelScan(): Promise<boolean>;
}

const {ProjectScanner} = NativeModules;

// Create emitter only if module exists
export const projectScannerEmitter = ProjectScanner
  ? new NativeEventEmitter(ProjectScanner)
  : null;

export default ProjectScanner as ProjectScannerModule;
