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
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Project Information</Text>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Ionicons name="document-text" size={16} color={theme.icon.secondary} />
            <Text style={styles.infoLabelText}>Name</Text>
          </View>
          <Text style={styles.infoValue}>{project.name || project.folderName}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Ionicons name="folder" size={16} color={theme.icon.secondary} />
            <Text style={styles.infoLabelText}>Folder Name</Text>
          </View>
          <Text style={styles.infoValue}>{project.folderName}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Ionicons name="folder-open" size={16} color={theme.icon.secondary} />
            <Text style={styles.infoLabelText}>Path</Text>
          </View>
          <Text style={styles.infoValue} numberOfLines={2}>
            {project.path}
          </Text>
        </View>

        {project.version && (
          <>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="pricetag" size={16} color={theme.icon.secondary} />
                <Text style={styles.infoLabelText}>Version</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>v{project.version}</Text>
              </View>
            </View>
          </>
        )}

        {project.slug && (
          <>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="at" size={16} color={theme.icon.secondary} />
                <Text style={styles.infoLabelText}>Slug</Text>
              </View>
              <Text style={styles.infoValue}>{project.slug}</Text>
            </View>
          </>
        )}

        {project.scheme && (
          <>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="link" size={16} color={theme.icon.secondary} />
                <Text style={styles.infoLabelText}>Scheme</Text>
              </View>
              <Text style={styles.infoValue}>{project.scheme}</Text>
            </View>
          </>
        )}

        {project.sdkVersion && (
          <>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="logo-react" size={16} color={theme.icon.secondary} />
                <Text style={styles.infoLabelText}>Expo SDK</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>SDK {project.sdkVersion}</Text>
              </View>
            </View>
          </>
        )}

        {project.usesNewArch !== undefined && project.usesNewArch !== null && (
          <>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="construct" size={16} color={theme.icon.secondary} />
                <Text style={styles.infoLabelText}>New Architecture</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {project.usesNewArch ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
            </View>
          </>
        )}

        {project.size && (
          <>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="server" size={16} color={theme.icon.secondary} />
                <Text style={styles.infoLabelText}>Size</Text>
              </View>
              <Text style={styles.infoValue}>{project.size}</Text>
            </View>
          </>
        )}

        {project.iconPath && (
          <>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="image" size={16} color={theme.icon.secondary} />
                <Text style={styles.infoLabelText}>Icon Path</Text>
              </View>
              <Text style={styles.infoValue} numberOfLines={1}>
                {project.iconPath.split('/').pop()}
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Timestamps */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Timestamps</Text>
        </View>

        {project.createdAt && (
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Ionicons name="add-circle" size={16} color={theme.icon.secondary} />
              <Text style={styles.infoLabelText}>Added</Text>
            </View>
            <Text style={styles.infoValue}>
              {new Date(project.createdAt).toLocaleString()}
            </Text>
          </View>
        )}

        {project.updatedAt && (
          <>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="refresh-circle" size={16} color={theme.icon.secondary} />
                <Text style={styles.infoLabelText}>Updated</Text>
              </View>
              <Text style={styles.infoValue}>
                {new Date(project.updatedAt).toLocaleString()}
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Database Info */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Database</Text>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Ionicons name="key" size={16} color={theme.icon.secondary} />
            <Text style={styles.infoLabelText}>Project ID</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>#{project.id}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabContent: {
    backgroundColor: theme.background.primary,
  },
  tabContentContainer: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  card: {
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    backgroundColor: theme.background.card,
    borderWidth: 1,
    borderColor: theme.border.default,
  },
  cardHeader: {
    marginBottom: 16,
    gap: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.text.primary,
    letterSpacing: -0.3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    gap: 16,
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  infoLabelText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text.secondary,
    letterSpacing: -0.1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.text.primary,
    letterSpacing: -0.1,
    textAlign: 'right',
    flex: 1,
  },
  badge: {
    backgroundColor: theme.background.elevated,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border.default,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.text.primary,
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: theme.border.subtle,
  },
});
