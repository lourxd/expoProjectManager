import {NativeModules} from 'react-native';

export interface CommandRunnerResult {
  exitCode: number;
  output: string;
}

export interface CommandRunnerModule {
  run(command: string): Promise<CommandRunnerResult>;
}

const {CommandRunner} = NativeModules;

export default CommandRunner as CommandRunnerModule;
