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
      {/* Title Row */}
      <View style={styles.titleRow}>
        {project.iconPath && !imageError ? (
          <Image
            source={{uri: `file://${project.iconPath}`}}
            style={styles.projectIcon}
            resizeMode="contain"
            onError={() => setImageError(true)}
          />
        ) : (
          <Ionicons name="folder" size={18} color={theme.brand.primary} />
        )}
        <Text style={styles.title}>{project.name || project.folderName}</Text>
        {project.version && (
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>{project.version}</Text>
          </View>
        )}
      </View>

      {/* Info & Actions Row */}
      <View style={styles.infoRow}>
        <View style={styles.quickInfo}>
          {project.sdkVersion && (
            <View style={styles.infoChip}>
              <Ionicons name="logo-react" size={12} color={theme.brand.primary} />
              <Text style={styles.infoChipText}>SDK {project.sdkVersion}</Text>
            </View>
          )}
          {project.projectSize && (
            <View style={styles.infoChip}>
              <Ionicons name="document" size={12} color={theme.text.tertiary} />
              <Text style={styles.infoChipText}>{project.projectSize}</Text>
            </View>
          )}
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
                <Ionicons name={action.icon} size={16} color={action.color} />
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
    padding: 16,
    paddingTop: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.border.subtle,
    backgroundColor: theme.background.primary,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  projectIcon: {
    width: 18,
    height: 18,
    borderRadius: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.text.primary,
    letterSpacing: -0.3,
    flex: 1,
  },
  versionBadge: {
    backgroundColor: theme.background.elevated,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  versionText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.text.secondary,
    letterSpacing: 0.2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quickInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: theme.background.elevated,
  },
  infoChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.text.secondary,
    letterSpacing: 0.1,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: theme.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionImage: {
    width: 24,
    height: 24,
  },
});
