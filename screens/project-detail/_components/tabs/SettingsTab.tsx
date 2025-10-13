import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, ScrollView, TouchableOpacity, ActivityIndicator} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {theme} from '../../../../theme/colors';
import {useProject} from '../../../../contexts/ProjectContext';
import PackageModalManager from '../../../../nativeModules/ModalManager';
import PackageChecker, {OutdatedPackage} from '../../../../nativeModules/PackageChecker';

export default function SettingsTab() {
  const {project} = useProject();
  const [outdatedPackages, setOutdatedPackages] = useState<OutdatedPackage[]>([]);
  const [isCheckingOutdated, setIsCheckingOutdated] = useState(false);

  const parseDependencies = (): Record<string, string> => {
    if (!project.dependencies) return {};
    try {
      return JSON.parse(project.dependencies);
    } catch {
      return {};
    }
  };

  const parseDevDependencies = (): Record<string, string> => {
    if (!project.devDependencies) return {};
    try {
      return JSON.parse(project.devDependencies);
    } catch {
      return {};
    }
  };

  const dependencies = parseDependencies();
  const devDependencies = parseDevDependencies();

  const dependencyEntries = Object.entries(dependencies);
  const devDependencyEntries = Object.entries(devDependencies);

  useEffect(() => {
    checkOutdatedPackages();
  }, [project.path]);

  const checkOutdatedPackages = async () => {
    try {
      setIsCheckingOutdated(true);
      const outdated = await PackageChecker.checkOutdatedPackages(project.path);
      setOutdatedPackages(outdated);
    } catch (error) {
      console.error('Error checking outdated packages:', error);
    } finally {
      setIsCheckingOutdated(false);
    }
  };

  const handleShowAllPackages = async () => {
    try {
      await PackageModalManager.showPackagesModal(
        project.dependencies || '{}',
        project.devDependencies || '{}'
      );
    } catch (error) {
      console.error('Error showing packages modal:', error);
    }
  };

  return (
    <>
      <ScrollView
        style={styles.tabContent}
        contentContainerStyle={styles.tabContentContainer}
        showsVerticalScrollIndicator={false}>

        {/* Summary Stats */}
        {(dependencyEntries.length > 0 || devDependencyEntries.length > 0) && (
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Ionicons name="cube" size={16} color={theme.brand.primary} />
              <Text style={styles.statValue}>{dependencyEntries.length}</Text>
              <Text style={styles.statLabel}>Dependencies</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="construct" size={16} color={theme.icon.secondary} />
              <Text style={styles.statValue}>{devDependencyEntries.length}</Text>
              <Text style={styles.statLabel}>Dev Dependencies</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="albums" size={16} color={theme.brand.accent} />
              <Text style={styles.statValue}>
                {dependencyEntries.length + devDependencyEntries.length}
              </Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
        )}

        {/* View All Button */}
        {(dependencyEntries.length > 0 || devDependencyEntries.length > 0) && (
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={handleShowAllPackages}>
            <View style={styles.viewAllContent}>
              <Ionicons name="list" size={20} color={theme.brand.primary} />
              <Text style={styles.viewAllText}>View All Packages</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text.tertiary} />
          </TouchableOpacity>
        )}

        {/* Outdated Packages Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="warning" size={16} color={theme.brand.warning} />
            <Text style={styles.cardTitle}>Outdated Packages</Text>
            {isCheckingOutdated && (
              <ActivityIndicator size="small" color={theme.brand.primary} />
            )}
            {!isCheckingOutdated && outdatedPackages.length > 0 && (
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{outdatedPackages.length}</Text>
              </View>
            )}
          </View>

          {isCheckingOutdated ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyDescription}>Checking for updates...</Text>
            </View>
          ) : outdatedPackages.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-circle" size={32} color={theme.icon.success} />
              <Text style={styles.emptyTitle}>All Up to Date</Text>
              <Text style={styles.emptyDescription}>
                No outdated packages found
              </Text>
            </View>
          ) : (
            <View style={styles.packageList}>
              {outdatedPackages.map((pkg, index) => (
                <View key={index} style={styles.outdatedPackageItem}>
                  <View style={styles.packageInfo}>
                    <Ionicons name="cube-outline" size={14} color={theme.brand.warning} />
                    <Text style={styles.packageName}>{pkg.name}</Text>
                  </View>
                  <View style={styles.versionInfo}>
                    <View style={styles.versionBadge}>
                      <Text style={styles.versionLabel}>Current</Text>
                      <Text style={styles.versionValue}>{pkg.current}</Text>
                    </View>
                    <Ionicons name="arrow-forward" size={12} color={theme.text.tertiary} />
                    <View style={[styles.versionBadge, styles.versionBadgeLatest]}>
                      <Text style={styles.versionLabel}>Latest</Text>
                      <Text style={styles.versionValue}>{pkg.latest}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Empty State */}
        {dependencyEntries.length === 0 && devDependencyEntries.length === 0 && (
          <View style={styles.card}>
            <View style={styles.emptyState}>
              <Ionicons name="cube-outline" size={48} color={theme.icon.secondary} />
              <Text style={styles.emptyTitle}>No Package Data</Text>
              <Text style={styles.emptyDescription}>
                Dependencies information is not available for this project
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </>
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
    fontSize: 20,
    fontWeight: '700',
    color: theme.text.primary,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.text.secondary,
    letterSpacing: 0.1,
    textAlign: 'center',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 10,
    backgroundColor: theme.background.card,
    borderWidth: 1,
    borderColor: theme.border.default,
  },
  viewAllContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  viewAllText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.brand.primary,
    letterSpacing: -0.2,
  },
  card: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: theme.background.card,
    borderWidth: 1,
    borderColor: theme.border.default,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.text.primary,
    letterSpacing: -0.2,
    flex: 1,
  },
  countBadge: {
    backgroundColor: 'rgba(255, 159, 10, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 159, 10, 0.3)',
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.brand.warning,
  },
  packageList: {
    gap: 8,
  },
  outdatedPackageItem: {
    padding: 12,
    backgroundColor: theme.background.elevated,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border.subtle,
    gap: 10,
  },
  packageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  packageName: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.text.primary,
    letterSpacing: -0.1,
  },
  versionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 22,
  },
  versionBadge: {
    flex: 1,
    gap: 2,
  },
  versionBadgeLatest: {
    backgroundColor: 'rgba(48, 209, 88, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  versionLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: theme.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  versionValue: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.text.primary,
    fontFamily: 'monospace',
    letterSpacing: 0.2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text.primary,
    letterSpacing: -0.2,
  },
  emptyDescription: {
    fontSize: 12,
    color: theme.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
