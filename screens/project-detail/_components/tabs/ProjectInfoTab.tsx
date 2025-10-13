import React from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {theme} from '../../../../theme/colors';
import {useProject} from '../../../../contexts/ProjectContext';

export default function ProjectInfoTab() {
  const {project} = useProject();

  return (
    <ScrollView
      style={styles.tabContent}
      contentContainerStyle={styles.tabContentContainer}
      showsVerticalScrollIndicator={false}>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        {project.folderSize && (
          <View style={styles.statCard}>
            <Ionicons name="folder" size={16} color={theme.brand.primary} />
            <Text style={styles.statValue}>{project.folderSize}</Text>
            <Text style={styles.statLabel}>Total Size</Text>
          </View>
        )}
        {project.projectSize && (
          <View style={styles.statCard}>
            <Ionicons name="document" size={16} color={theme.brand.primary} />
            <Text style={styles.statValue}>{project.projectSize}</Text>
            <Text style={styles.statLabel}>Project Size</Text>
          </View>
        )}
      </View>

      {/* Main Info Card */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{project.name || project.folderName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Folder</Text>
          <Text style={styles.value}>{project.folderName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Path</Text>
          <Text style={styles.value} numberOfLines={1}>{project.path}</Text>
        </View>
        {project.slug && (
          <View style={styles.row}>
            <Text style={styles.label}>Slug</Text>
            <Text style={styles.value}>{project.slug}</Text>
          </View>
        )}
        {project.scheme && (
          <View style={styles.row}>
            <Text style={styles.label}>Scheme</Text>
            <Text style={styles.value}>{project.scheme}</Text>
          </View>
        )}
      </View>

      {/* Platform IDs */}
      {(project.bundleIdentifier || project.androidPackage) && (
        <View style={styles.card}>
          {project.bundleIdentifier && (
            <View style={styles.row}>
              <View style={styles.labelWithIcon}>
                <Ionicons name="logo-apple" size={14} color={theme.text.secondary} />
                <Text style={styles.label}>iOS Bundle</Text>
              </View>
              <Text style={styles.value}>{project.bundleIdentifier}</Text>
            </View>
          )}
          {project.androidPackage && (
            <View style={styles.row}>
              <View style={styles.labelWithIcon}>
                <Ionicons name="logo-android" size={14} color={theme.text.secondary} />
                <Text style={styles.label}>Android Package</Text>
              </View>
              <Text style={styles.value}>{project.androidPackage}</Text>
            </View>
          )}
        </View>
      )}

      {/* Architecture & Timestamps */}
      <View style={styles.card}>
        {project.usesNewArch !== undefined && project.usesNewArch !== null && (
          <View style={styles.row}>
            <Text style={styles.label}>New Architecture</Text>
            <View style={[styles.badge, project.usesNewArch && styles.badgeSuccess]}>
              <Text style={styles.badgeText}>
                {project.usesNewArch ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
          </View>
        )}
        {project.createdAt && (
          <View style={styles.row}>
            <Text style={styles.label}>Created</Text>
            <Text style={styles.value}>{new Date(project.createdAt).toLocaleDateString()}</Text>
          </View>
        )}
        {project.updatedAt && (
          <View style={styles.row}>
            <Text style={styles.label}>Last Updated</Text>
            <Text style={styles.value}>{new Date(project.updatedAt).toLocaleDateString()}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabContent: {
    backgroundColor: theme.background.primary,
  },
  tabContentContainer: {
    padding: 16,
    gap: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
    backgroundColor: theme.background.card,
    borderWidth: 1,
    borderColor: theme.border.default,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.text.primary,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.text.secondary,
    letterSpacing: 0.1,
  },
  card: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: theme.background.card,
    borderWidth: 1,
    borderColor: theme.border.default,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.text.secondary,
    letterSpacing: -0.1,
  },
  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.text.primary,
    letterSpacing: -0.1,
    textAlign: 'right',
    flex: 1,
  },
  badge: {
    backgroundColor: 'rgba(255, 159, 10, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeSuccess: {
    backgroundColor: 'rgba(48, 209, 88, 0.15)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.text.primary,
    letterSpacing: 0.2,
  },
});
