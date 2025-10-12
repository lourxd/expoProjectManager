import {Ionicons} from '@expo/vector-icons';
import React, {useState} from 'react';
import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {theme} from '../../../theme/colors';
import {useProject} from '../../../contexts/ProjectContext';
import CommandRunner from '../../../nativeModules/CommandRunner';

export default function ProjectHeader() {
  const {project} = useProject();
  const [imageError, setImageError] = useState(false);

  const actions = [
    {
      icon: 'terminal' as const,
      color: theme.brand.primary,
      onPress: async () => {
        await CommandRunner.run(`open -a "Terminal" "${project.path}"`);
      },
    },
    {
      image: require('../../../assets/images/vs-code.png'),
      onPress: async () => {
        await CommandRunner.run(`open -a "Visual Studio Code" "${project.path}"`);
      },
    },
    {
      image: require('../../../assets/images/warp.png'),
      onPress: async () => {
        await CommandRunner.run(`open -a "Warp" "${project.path}"`);
      },
    },
    {
      icon: 'folder-open' as const,
      color: theme.icon.success,
      onPress: async () => {
        await CommandRunner.run(`open "${project.path}"`);
      },
    },
    {
      icon: 'logo-github' as const,
      color: theme.text.primary,
      onPress: async () => {
        await CommandRunner.run(`cd "${project.path}" && git config --get remote.origin.url | xargs open`);
      },
    },
  ];

  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <View style={styles.iconBadge}>
          {project.iconPath && !imageError ? (
            <Image
              source={{uri: `file://${project.iconPath}`}}
              style={styles.projectIconLarge}
              resizeMode="contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <Ionicons name="folder" size={32} color={theme.brand.primary} />
          )}
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>{project.name || project.folderName}</Text>
          <Text style={styles.subtitle}>Project Details</Text>
        </View>
        <View style={styles.actionsRow}>
          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionButton}
              onPress={action.onPress}>
              {'image' in action ? (
                <Image source={action.image} style={styles.actionImage} resizeMode="contain" />
              ) : (
                <Ionicons name={action.icon} size={20} color={action.color} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 24,
    paddingTop: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBadge: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: theme.background.elevated,
    borderWidth: 1,
    borderColor: theme.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  projectIconLarge: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.text.primary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: theme.text.secondary,
    letterSpacing: -0.2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: theme.background.elevated,
    borderWidth: 1,
    borderColor: theme.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionImage: {
    width: 32,
    height: 32,
  },
});
