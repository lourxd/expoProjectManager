import React from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {theme} from '../../../../theme/colors';
import {useProject} from '../../../../contexts/ProjectContext';

export default function DetailsTab() {
  const {project} = useProject();

  const parsePlatforms = (): string[] => {
    if (!project.platforms) return [];
    try {
      return JSON.parse(project.platforms);
    } catch {
      return [];
    }
  };

  const parsePermissions = (): string[] => {
    if (!project.permissions) return [];
    try {
      return JSON.parse(project.permissions);
    } catch {
      return [];
    }
  };

  const parsePlugins = (): any[] => {
    if (!project.plugins) return [];
    try {
      return JSON.parse(project.plugins);
    } catch {
      return [];
    }
  };

  const parseSplash = (): any => {
    if (!project.splash) return null;
    try {
      return JSON.parse(project.splash);
    } catch {
      return null;
    }
  };

  const parseUpdates = (): any => {
    if (!project.updates) return null;
    try {
      return JSON.parse(project.updates);
    } catch {
      return null;
    }
  };

  const platforms = parsePlatforms();
  const permissions = parsePermissions();
  const plugins = parsePlugins();
  const splash = parseSplash();
  const updates = parseUpdates();

  const hasAnyData =
    platforms.length > 0 ||
    permissions.length > 0 ||
    plugins.length > 0 ||
    splash ||
    updates ||
    project.backgroundColor ||
    project.primaryColor ||
    project.orientation;

  if (!hasAnyData) {
    return (
      <ScrollView
        style={styles.tabContent}
        contentContainerStyle={styles.tabContentContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.emptyState}>
            <Ionicons name="settings-outline" size={48} color={theme.text.tertiary} />
            <Text style={styles.emptyTitle}>No Configuration Data</Text>
            <Text style={styles.emptyDescription}>
              This project needs to be rescanned to collect configuration data.{'\n'}
              Go to Home screen and rescan your projects folder.
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.tabContent}
      contentContainerStyle={styles.tabContentContainer}
      showsVerticalScrollIndicator={false}>

      {/* Platforms */}
      {platforms.length > 0 && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="phone-portrait" size={18} color={theme.brand.primary} />
            <Text style={styles.cardTitle}>Platforms</Text>
          </View>
          <View style={styles.tagContainer}>
            {platforms.map((platform, index) => (
              <View key={index} style={styles.tag}>
                <Ionicons
                  name={
                    platform === 'ios' ? 'logo-apple' :
                    platform === 'android' ? 'logo-android' :
                    platform === 'web' ? 'globe' : 'apps'
                  }
                  size={14}
                  color={theme.text.primary}
                />
                <Text style={styles.tagText}>{platform}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Colors */}
      {(project.backgroundColor || project.primaryColor || project.orientation) && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="color-palette" size={18} color={theme.brand.primary} />
            <Text style={styles.cardTitle}>Theme & Display</Text>
          </View>

          {project.orientation && (
            <>
              <View style={styles.infoRow}>
                <View style={styles.infoLabel}>
                  <Ionicons name="phone-portrait" size={14} color={theme.icon.secondary} />
                  <Text style={styles.infoLabelText}>Orientation</Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{project.orientation}</Text>
                </View>
              </View>
              <View style={styles.divider} />
            </>
          )}

          {project.backgroundColor && (
            <>
              <View style={styles.infoRow}>
                <View style={styles.infoLabel}>
                  <View style={[styles.colorDot, {backgroundColor: project.backgroundColor}]} />
                  <Text style={styles.infoLabelText}>Background</Text>
                </View>
                <Text style={styles.infoValue}>{project.backgroundColor}</Text>
              </View>
              <View style={styles.divider} />
            </>
          )}

          {project.primaryColor && (
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <View style={[styles.colorDot, {backgroundColor: project.primaryColor}]} />
                <Text style={styles.infoLabelText}>Primary</Text>
              </View>
              <Text style={styles.infoValue}>{project.primaryColor}</Text>
            </View>
          )}
        </View>
      )}

      {/* Splash Screen */}
      {splash && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="image" size={18} color={theme.brand.primary} />
            <Text style={styles.cardTitle}>Splash Screen</Text>
          </View>
          {splash.image && (
            <>
              <View style={styles.infoRow}>
                <View style={styles.infoLabel}>
                  <Ionicons name="image" size={14} color={theme.icon.secondary} />
                  <Text style={styles.infoLabelText}>Image</Text>
                </View>
                <Text style={styles.infoValue}>{splash.image}</Text>
              </View>
              <View style={styles.divider} />
            </>
          )}
          {splash.backgroundColor && (
            <>
              <View style={styles.infoRow}>
                <View style={styles.infoLabel}>
                  <View style={[styles.colorDot, {backgroundColor: splash.backgroundColor}]} />
                  <Text style={styles.infoLabelText}>Background</Text>
                </View>
                <Text style={styles.infoValue}>{splash.backgroundColor}</Text>
              </View>
              <View style={styles.divider} />
            </>
          )}
          {splash.resizeMode && (
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="resize" size={14} color={theme.icon.secondary} />
                <Text style={styles.infoLabelText}>Resize Mode</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{splash.resizeMode}</Text>
              </View>
            </View>
          )}
        </View>
      )}

      {/* Updates */}
      {updates && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="cloud-download" size={18} color={theme.brand.primary} />
            <Text style={styles.cardTitle}>OTA Updates</Text>
          </View>
          {updates.url && (
            <>
              <View style={styles.infoRow}>
                <View style={styles.infoLabel}>
                  <Ionicons name="link" size={14} color={theme.icon.secondary} />
                  <Text style={styles.infoLabelText}>URL</Text>
                </View>
                <Text style={styles.infoValue} numberOfLines={1}>{updates.url}</Text>
              </View>
              <View style={styles.divider} />
            </>
          )}
          {updates.checkAutomatically && (
            <>
              <View style={styles.infoRow}>
                <View style={styles.infoLabel}>
                  <Ionicons name="sync" size={14} color={theme.icon.secondary} />
                  <Text style={styles.infoLabelText}>Check Mode</Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{updates.checkAutomatically}</Text>
                </View>
              </View>
              <View style={styles.divider} />
            </>
          )}
          {updates.fallbackToCacheTimeout !== undefined && (
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="time" size={14} color={theme.icon.secondary} />
                <Text style={styles.infoLabelText}>Timeout</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{updates.fallbackToCacheTimeout}ms</Text>
              </View>
            </View>
          )}
        </View>
      )}

      {/* Permissions */}
      {permissions.length > 0 && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="shield-checkmark" size={18} color={theme.brand.primary} />
            <Text style={styles.cardTitle}>Permissions</Text>
          </View>
          <View style={styles.tagContainer}>
            {permissions.map((permission, index) => (
              <View key={index} style={styles.permissionTag}>
                <Ionicons name="checkmark-circle" size={12} color={theme.brand.accent} />
                <Text style={styles.tagText}>{permission}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Plugins */}
      {plugins.length > 0 && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="extension-puzzle" size={18} color={theme.brand.primary} />
            <Text style={styles.cardTitle}>Plugins</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{plugins.length}</Text>
            </View>
          </View>
          <View style={styles.pluginList}>
            {plugins.map((plugin, index) => {
              const pluginName = typeof plugin === 'string' ? plugin : plugin[0];
              const hasConfig = Array.isArray(plugin) && plugin.length > 1;
              return (
                <View key={index} style={styles.pluginItem}>
                  <View style={styles.pluginHeader}>
                    <Ionicons name="cube" size={14} color={theme.brand.primary} />
                    <Text style={styles.pluginName}>{pluginName}</Text>
                  </View>
                  {hasConfig && (
                    <View style={styles.pluginConfigBadge}>
                      <Ionicons name="settings" size={10} color={theme.text.tertiary} />
                      <Text style={styles.pluginConfigText}>configured</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      )}
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
    flex: 1,
  },
  countBadge: {
    backgroundColor: theme.background.elevated,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.border.default,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.text.primary,
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
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.text.primary,
    letterSpacing: 0.3,
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: theme.border.default,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.background.elevated,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border.default,
  },
  permissionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(48, 209, 88, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(48, 209, 88, 0.3)',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.text.primary,
    letterSpacing: -0.1,
  },
  divider: {
    height: 1,
    backgroundColor: theme.border.subtle,
  },
  pluginList: {
    gap: 10,
  },
  pluginItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: theme.background.elevated,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.border.subtle,
  },
  pluginHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  pluginName: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.text.primary,
    letterSpacing: -0.1,
  },
  pluginConfigBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: theme.background.secondary,
    borderRadius: 6,
  },
  pluginConfigText: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.text.tertiary,
    letterSpacing: 0.2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.text.primary,
    letterSpacing: -0.3,
  },
  emptyDescription: {
    fontSize: 13,
    color: theme.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
