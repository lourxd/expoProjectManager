import React from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {theme} from '../../../../theme/colors';
import {useProject} from '../../../../contexts/ProjectContext';

export default function ProjectInfoTab() {
  const {project} = useProject();

  const InfoRow = ({icon, label, value, badge}: {icon: any; label: string; value: string; badge?: boolean}) => (
    <>
      <View style={styles.infoRow}>
        <View style={styles.infoLabel}>
          <Ionicons name={icon} size={14} color={theme.icon.secondary} />
          <Text style={styles.infoLabelText}>{label}</Text>
        </View>
        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{value}</Text>
          </View>
        ) : (
          <Text style={styles.infoValue}>{value}</Text>
        )}
      </View>
      <View style={styles.divider} />
    </>
  );

  return (
    <ScrollView
      style={styles.tabContent}
      contentContainerStyle={styles.tabContentContainer}
      showsVerticalScrollIndicator={false}>

      {/* Basic Info */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="information-circle" size={18} color={theme.brand.primary} />
          <Text style={styles.cardTitle}>Basic Information</Text>
        </View>

        <InfoRow icon="document-text" label="Name" value={project.name || project.folderName} />
        <InfoRow icon="folder" label="Folder" value={project.folderName} />

        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Ionicons name="folder-open" size={14} color={theme.icon.secondary} />
            <Text style={styles.infoLabelText}>Path</Text>
          </View>
          <Text style={styles.infoValue} numberOfLines={2}>
            {project.path}
          </Text>
        </View>
        <View style={styles.divider} />

        {project.slug && <InfoRow icon="at" label="Slug" value={project.slug} />}
        {project.scheme && <InfoRow icon="link" label="Scheme" value={project.scheme} />}
        {project.bundleIdentifier && <InfoRow icon="logo-apple" label="Bundle ID" value={project.bundleIdentifier} />}
        {project.androidPackage && <InfoRow icon="logo-android" label="Package" value={project.androidPackage} />}

        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Ionicons name="key" size={14} color={theme.icon.secondary} />
            <Text style={styles.infoLabelText}>ID</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>#{project.id}</Text>
          </View>
        </View>
      </View>

      {/* Version & SDK */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="code-slash" size={18} color={theme.brand.primary} />
          <Text style={styles.cardTitle}>Version & SDK</Text>
        </View>

        {project.version && <InfoRow icon="pricetag" label="Version" value={`v${project.version}`} badge />}
        {project.sdkVersion && <InfoRow icon="logo-react" label="Expo SDK" value={`SDK ${project.sdkVersion}`} badge />}

        {project.usesNewArch !== undefined && project.usesNewArch !== null && (
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Ionicons name="construct" size={14} color={theme.icon.secondary} />
              <Text style={styles.infoLabelText}>New Architecture</Text>
            </View>
            <View style={[styles.badge, project.usesNewArch && styles.badgeSuccess]}>
              <Text style={styles.badgeText}>
                {project.usesNewArch ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Storage */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="server" size={18} color={theme.brand.primary} />
          <Text style={styles.cardTitle}>Storage</Text>
        </View>

        {project.folderSize && <InfoRow icon="folder" label="Total Size" value={project.folderSize} badge />}
        {project.projectSize && <InfoRow icon="document" label="Project Size" value={project.projectSize} badge />}
        {project.iconPath && (
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Ionicons name="image" size={14} color={theme.icon.secondary} />
              <Text style={styles.infoLabelText}>Icon</Text>
            </View>
            <Text style={styles.infoValue} numberOfLines={1}>
              {project.iconPath.split('/').pop()}
            </Text>
          </View>
        )}
      </View>

      {/* Timestamps */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="time" size={18} color={theme.brand.primary} />
          <Text style={styles.cardTitle}>Timestamps</Text>
        </View>

        {project.createdAt && (
          <>
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="add-circle" size={14} color={theme.icon.secondary} />
                <Text style={styles.infoLabelText}>Added</Text>
              </View>
              <Text style={styles.infoValue}>
                {new Date(project.createdAt).toLocaleString()}
              </Text>
            </View>
            <View style={styles.divider} />
          </>
        )}

        {project.updatedAt && (
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Ionicons name="refresh-circle" size={14} color={theme.icon.secondary} />
              <Text style={styles.infoLabelText}>Updated</Text>
            </View>
            <Text style={styles.infoValue}>
              {new Date(project.updatedAt).toLocaleString()}
            </Text>
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
    paddingBottom: 24,
  },
  card: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 14,
    backgroundColor: theme.background.card,
    borderWidth: 1,
    borderColor: theme.border.default,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.text.primary,
    letterSpacing: -0.3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    gap: 12,
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  infoLabelText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.text.secondary,
    letterSpacing: -0.1,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.text.primary,
    letterSpacing: -0.1,
    textAlign: 'right',
    flex: 1,
  },
  badge: {
    backgroundColor: theme.background.elevated,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border.default,
  },
  badgeSuccess: {
    backgroundColor: 'rgba(48, 209, 88, 0.15)',
    borderColor: 'rgba(48, 209, 88, 0.3)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.text.primary,
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    backgroundColor: theme.border.subtle,
  },
});
