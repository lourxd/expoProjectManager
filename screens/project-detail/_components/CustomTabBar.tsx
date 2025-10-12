import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {theme} from '../../../theme/colors';
import type {NavigationState, SceneRendererProps} from 'react-native-tab-view';

type Route = {
  key: string;
  title: string;
  icon: string;
};

type CustomTabBarProps = SceneRendererProps & {
  navigationState: NavigationState<Route>;
  index: number;
};

export default function CustomTabBar({
  navigationState,
  jumpTo,
  index,
}: CustomTabBarProps) {
  return (
    <View style={styles.tabBar}>
      {navigationState.routes.map((route, i) => {
        const isActive = index === i;
        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tab}
            onPress={() => jumpTo(route.key)}>
            <Ionicons
              name={route.icon as any}
              size={18}
              color={isActive ? theme.brand.primary : theme.text.tertiary}
            />
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {route.title}
            </Text>
            {isActive && <View style={styles.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: theme.border.subtle,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
    position: 'relative',
  },
  tabLabel: {
    fontWeight: '600',
    fontSize: 13,
    letterSpacing: -0.1,
    color: theme.text.tertiary,
  },
  tabLabelActive: {
    color: theme.brand.primary,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: theme.brand.primary,
  },
});
