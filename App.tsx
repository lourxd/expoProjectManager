import React, { useEffect } from 'react';
import 'react-native-reanimated';
import { runMigrations } from './db';
import { MainNavigator } from './navigation';

export default function App(): React.JSX.Element {
  useEffect(() => {
    // Run migrations on mount
    runMigrations();
  }, []);

  return <MainNavigator />;
}
