import React, {useState, useEffect} from 'react';
import {Pressable, StyleSheet, Text, View, ScrollView, Image} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {db, $} from '../../db';
import type {Project} from '../../db';
import {theme} from '../../theme/colors';
import {Logo} from './Logo';

type SidebarProps = {
  selectedRoute: string;
  onRouteSelect: (routeKey: string) => void;
};

type SidebarItemProps = {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPath?: string;
  isActive: boolean;
  onPress: () => void;
  badge?: number;
};

const SidebarItem: React.FC<SidebarItemProps> = ({
  title,
  subtitle,
  icon,
  iconPath,
  isActive,
  onPress,
  badge,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <Pressable
      style={[
        styles.sidebarItem,
        isActive && styles.sidebarItemActive,
        isHovered && !isActive && styles.sidebarItemHovered,
      ]}
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}>
      {isActive && <View style={styles.activeIndicator} />}
      <View style={styles.iconContainer}>
        {iconPath && !imageError ? (
          <Image
            source={{uri: `file://${iconPath}`}}
            style={styles.projectIcon}
            resizeMode="contain"
            onError={() => setImageError(true)}
          />
        ) : icon ? (
          <Ionicons
            name={icon}
            size={20}
            color={isActive ? theme.icon.brand : theme.icon.secondary}
          />
        ) : (
          <Ionicons
            name="folder"
            size={20}
            color={isActive ? theme.icon.brand : theme.icon.secondary}
          />
        )}
      </View>
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.sidebarItemText,
            isActive && styles.sidebarItemTextActive,
          ]}
          numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.sidebarItemSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
      {badge !== undefined && badge > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </Pressable>
  );
};

const SectionHeader: React.FC<{title: string}> = ({title}) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionLine} />
  </View>
);

export const Sidebar: React.FC<SidebarProps> = ({
  selectedRoute,
  onRouteSelect,
}) => {
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
    <View style={styles.sidebar}>
      {/* Logo Header */}
      <Logo />

      {/* Main Navigation */}
      <ScrollView
        style={styles.sidebarContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <SidebarItem
            title="Dashboard"
            icon="home"
            isActive={selectedRoute === 'home'}
            onPress={() => onRouteSelect('home')}
          />
        </View>

        {/* Projects Section */}
        {projects.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Projects" />
            {projects.map(project => (
              <SidebarItem
                key={project.id}
                title={project.name || project.folderName}
                subtitle={project.path}
                iconPath={project.iconPath || undefined}
                isActive={selectedRoute === `project-${project.id}`}
                onPress={() => onRouteSelect(`project-${project.id}`)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.sidebarBottom}>
        <View style={styles.divider} />
        <SidebarItem
          title="Settings"
          icon="settings-sharp"
          isActive={selectedRoute === 'settings'}
          onPress={() => onRouteSelect('settings')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 260,
    backgroundColor: theme.background.secondary,
    borderRightWidth: 1,
    borderRightColor: theme.border.subtle,
  },
  sidebarContent: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  section: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.text.tertiary,
    textTransform: 'uppercase',
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.border.subtle,
  },
  sidebarItem: {
    marginHorizontal: 8,
    marginVertical: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    paddingLeft: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    position: 'relative',
  },
  sidebarItemHovered: {
    backgroundColor: theme.interactive.hover,
  },
  sidebarItemActive: {
    backgroundColor: theme.interactive.selected,
  },
  iconContainer: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  projectIcon: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  textContainer: {
    flex: 1,
    gap: 1,
  },
  sidebarItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.text.secondary,
    letterSpacing: -0.1,
  },
  sidebarItemTextActive: {
    color: theme.text.primary,
    fontWeight: '600',
  },
  sidebarItemSubtitle: {
    fontSize: 10,
    fontWeight: '400',
    color: theme.text.muted,
    letterSpacing: -0.05,
    opacity: 0.7,
  },
  activeIndicator: {
    position: 'absolute',
    left: 1,
    top: 6,
    bottom: 6,
    width: 3,
    backgroundColor: theme.brand.primary,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  badge: {
    backgroundColor: theme.brand.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.text.primary,
  },
  sidebarBottom: {
    paddingVertical: 8,
  },
  divider: {
    height: 1,
    backgroundColor: theme.border.subtle,
    marginHorizontal: 12,
    marginBottom: 8,
  },
});
