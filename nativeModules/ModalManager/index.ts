import {NativeModules} from 'react-native';

export interface PackageModalManagerModule {
  showPackagesModal(
    dependencies: string,
    devDependencies: string
  ): Promise<boolean>;
  closeModal(): Promise<boolean>;
}

const {PackageModalManager} = NativeModules;

export default PackageModalManager as PackageModalManagerModule;
