import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View, useColorScheme} from 'react-native';
import 'react-native-reanimated';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import HomeScreen from './screens/Home/HomeScreen';
import ProfileScreen from './screens/Profile/ProfileScreen';
import SettingsScreen from './screens/Settings/SettingsScreen';

type Route = {
  key: string;
  title: string;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [selectedRoute, setSelectedRoute] = useState('home');

  const mainRoutes: Route[] = [
    {key: 'home', title: 'Projects'},
    {key: 'profile', title: 'About'},
  ];

  const bottomRoutes: Route[] = [{key: 'settings', title: 'Settings'}];

  const renderScreen = () => {
    switch (selectedRoute) {
      case 'home':
        return <HomeScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const SidebarItem = ({route}: {route: Route}) => {
    const isActive = selectedRoute === route.key;

    const animatedStyle = useAnimatedStyle(() => {
      return {
        backgroundColor: withTiming(
          isActive ? (isDarkMode ? '#2c2c2e' : '#e5e7eb') : 'transparent',
          {duration: 150},
        ),
      };
    });

    return (
      <AnimatedPressable
        style={[styles.sidebarItem, animatedStyle]}
        onPress={() => setSelectedRoute(route.key)}>
        <Text
          style={[
            styles.sidebarItemText,
            {
              color: isActive
                ? isDarkMode
                  ? '#ffffff'
                  : '#111827'
                : isDarkMode
                ? '#98989d'
                : '#6b7280',
            },
            isActive && {fontWeight: '600'},
          ]}>
          {route.title}
        </Text>
      </AnimatedPressable>
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.sidebar,
          {
            backgroundColor: isDarkMode ? '#1c1c1e' : '#f5f5f7',
            borderRightColor: isDarkMode ? '#2c2c2e' : '#e5e5e7',
          },
        ]}>
        <View
          style={[
            styles.sidebarHeader,
            {borderBottomColor: isDarkMode ? '#2c2c2e' : '#e5e5e7'},
          ]}>
          <Text
            style={[
              styles.sidebarTitle,
              {color: isDarkMode ? '#ffffff' : '#1d1d1f'},
            ]}>
            Expo Manager
          </Text>
        </View>

        <View style={styles.sidebarContent}>
          {mainRoutes.map(route => (
            <SidebarItem key={route.key} route={route} />
          ))}
        </View>

        <View
          style={[
            styles.sidebarBottom,
            {borderTopColor: isDarkMode ? '#2c2c2e' : '#e5e5e7'},
          ]}>
          {bottomRoutes.map(route => (
            <SidebarItem key={route.key} route={route} />
          ))}
        </View>
      </View>

      <View style={styles.content}>
        <Animated.View
          key={selectedRoute}
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
          style={{flex: 1}}>
          {renderScreen()}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 220,
    borderRightWidth: 1,
  },
  sidebarHeader: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  sidebarTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  sidebarContent: {
    flex: 1,
    paddingTop: 8,
  },
  sidebarBottom: {
    paddingTop: 8,
    paddingBottom: 8,
    borderTopWidth: 1,
  },
  sidebarItem: {
    marginHorizontal: 8,
    marginVertical: 2,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  sidebarItemText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
});

export default App;
