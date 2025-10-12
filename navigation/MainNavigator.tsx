import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import ProjectDetailScreen from '../screens/project-detail/screen';
import { Sidebar } from './components/Sidebar';
import { DEFAULT_ROUTE, allRoutes } from './routes';

type ScreenWrapperProps = {
  isActive: boolean;
  children: React.ReactNode;
  routeKey: string;
};

const ScreenWrapper: React.FC<ScreenWrapperProps> = React.memo(
  ({isActive, children, routeKey}) => {
    const animatedStyle = useAnimatedStyle(() => ({
      opacity: withTiming(isActive ? 1 : 0, {duration: 200}),
    }));

    return (
      <Animated.View
        key={routeKey}
        style={[
          styles.screenContainer,
          animatedStyle,
          !isActive && styles.hiddenScreen,
        ]}
        pointerEvents={isActive ? 'auto' : 'none'}>
        {children}
      </Animated.View>
    );
  },
);

ScreenWrapper.displayName = 'ScreenWrapper';

export const MainNavigator: React.FC = () => {
  const [selectedRoute, setSelectedRoute] = useState(DEFAULT_ROUTE);
  const [mountedProjectScreens, setMountedProjectScreens] = useState<
    Set<string>
  >(new Set());

  const handleRouteSelect = useCallback((route: string) => {
    setSelectedRoute(route);

    // Track mounted project screens
    if (route.startsWith('project-')) {
      setMountedProjectScreens(prev => new Set([...prev, route]));
    }
  }, []);

  return (
    <View style={styles.container}>
      <Sidebar
        selectedRoute={selectedRoute}
        onRouteSelect={handleRouteSelect}
      />

      <View style={styles.content}>
        {/* Static routes */}
        {allRoutes.map(route => {
          const Screen = route.component;
          return (
            <ScreenWrapper
              key={route.key}
              routeKey={route.key}
              isActive={selectedRoute === route.key}>
              <Screen />
            </ScreenWrapper>
          );
        })}

        {/* Dynamic project routes */}
        {Array.from(mountedProjectScreens).map(projectRoute => {
          const projId = parseInt(projectRoute.replace('project-', ''), 10);
          return (
            <ScreenWrapper
              key={projectRoute}
              routeKey={projectRoute}
              isActive={selectedRoute === projectRoute}>
              <ProjectDetailScreen projectId={projId} />
            </ScreenWrapper>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  screenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  hiddenScreen: {
    zIndex: -1,
  },
});
