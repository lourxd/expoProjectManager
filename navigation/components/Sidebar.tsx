import React, {useState, useEffect} from 'react';
import {Pressable, StyleSheet, Text, View, useColorScheme, ScrollView} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {db, $} from '../../db';
import type {Project} from '../../db';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type SidebarProps = {
  selectedRoute: string;
  onRouteSelect: (routeKey: string) => void;
};

type SidebarItemProps = {
  title: string;
  isActive: boolean;
  onPress: () => void;
  isDarkMode: boolean;
};

const SidebarItem: React.FC<SidebarItemProps> = ({
  title,
  isActive,
  onPress,
  isDarkMode,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        isActive ? (isDarkMode ? '#2c2c2e' : '#e5e7eb') : 'transparent',
        {duration: 150}
      ),
    };
  });

  return (
    <AnimatedPressable style={[styles.sidebarItem, animatedStyle]} onPress={onPress}>
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
        ]}
        numberOfLines={1}>
        {title}
      </Text>
    </AnimatedPressable>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  selectedRoute,
  onRouteSelect,
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    loadProjects();

    // Poll for updates every 2 seconds
    const interval = setInterval(loadProjects, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadProjects = async () => {
    try {
      const allProjects = await db.select().from($.project);
      setProjects(allProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  return (
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

      <ScrollView style={styles.sidebarContent} showsVerticalScrollIndicator={false}>
        {/* Home Section */}
        <SidebarItem
          title="Home"
          isActive={selectedRoute === 'home'}
          onPress={() => onRouteSelect('home')}
          isDarkMode={isDarkMode}
        />

        {/* Projects Section */}
        {projects.length > 0 && (
          <>
            <View
              style={[
                styles.separator,
                {borderBottomColor: isDarkMode ? '#2c2c2e' : '#e5e5e7'},
              ]}
            />
            <Text
              style={[
                styles.sectionTitle,
                {color: isDarkMode ? '#98989d' : '#6b7280'},
              ]}>
              PROJECTS
            </Text>
            {projects.map(project => (
              <SidebarItem
                key={project.id}
                title={project.name}
                isActive={selectedRoute === `project-${project.id}`}
                onPress={() => onRouteSelect(`project-${project.id}`)}
                isDarkMode={isDarkMode}
              />
            ))}
          </>
        )}
      </ScrollView>

      <View
        style={[
          styles.sidebarBottom,
          {borderTopColor: isDarkMode ? '#2c2c2e' : '#e5e5e7'},
        ]}>
        <SidebarItem
          title="Settings"
          isActive={selectedRoute === 'settings'}
          onPress={() => onRouteSelect('settings')}
          isDarkMode={isDarkMode}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  separator: {
    marginVertical: 12,
    marginHorizontal: 8,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    paddingVertical: 6,
    marginTop: 4,
  },
});
