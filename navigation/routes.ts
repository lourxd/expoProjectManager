import React from 'react';
import HomeScreen from '../screens/home/screen';
import SettingsScreen from '../screens/settings/screen';

export type Route = {
  key: string;
  title: string;
  component: React.ComponentType;
};

export const mainRoutes: Route[] = [
  {key: 'home', title: 'Home', component: HomeScreen},
];

export const bottomRoutes: Route[] = [
  {key: 'settings', title: 'Settings', component: SettingsScreen},
];

export const allRoutes: Route[] = [...mainRoutes, ...bottomRoutes];

export const DEFAULT_ROUTE = 'home';
