import {Ionicons} from '@expo/vector-icons';
import React, {useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {theme} from '../../../theme/colors';
import {Project} from '../../../db';

export default function ProjectHeader({project}: {project: Project}) {
  const [imageError, setImageError] = useState(false);

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
});
