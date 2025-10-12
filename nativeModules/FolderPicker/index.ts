import {NativeModules} from 'react-native';

export interface FolderPickerModule {
  pickFolder(): Promise<string | null>;
}

const {FolderPickerModule} = NativeModules;

export default FolderPickerModule as FolderPickerModule;
