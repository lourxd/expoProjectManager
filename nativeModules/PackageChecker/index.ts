import {NativeModules} from 'react-native';

export interface OutdatedPackage {
  name: string;
  current: string;
  wanted: string;
  latest: string;
}

export interface PackageCheckerModule {
  checkOutdatedPackages(projectPath: string): Promise<OutdatedPackage[]>;
}

const {PackageChecker} = NativeModules;

export default PackageChecker as PackageCheckerModule;
