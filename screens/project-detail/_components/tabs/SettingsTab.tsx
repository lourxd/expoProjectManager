import React from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {theme} from '../../../../theme/colors';
import {useProject} from '../../../../contexts/ProjectContext';

export default function SettingsTab() {
  const {project} = useProject();

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

  return (
    <ScrollView
      style={styles.tabContent}
      contentContainerStyle={styles.tabContentContainer}
      showsVerticalScrollIndicator={false}>

      {/* Summary */}
      {(dependencyEntries.length > 0 || devDependencyEntries.length > 0) && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="stats-chart" size={18} color={theme.brand.primary} />
            <Text style={styles.cardTitle}>Package Summary</Text>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <View style={styles.summaryIconContainer}>
                <Ionicons name="cube" size={16} color={theme.brand.primary} />
              </View>
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryValue}>{dependencyEntries.length}</Text>
                <Text style={styles.summaryLabel}>Dependencies</Text>
              </View>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryItem}>
              <View style={styles.summaryIconContainer}>
                <Ionicons name="construct" size={16} color={theme.icon.secondary} />
              </View>
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryValue}>{devDependencyEntries.length}</Text>
                <Text style={styles.summaryLabel}>Dev Dependencies</Text>
              </View>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryItem}>
              <View style={styles.summaryIconContainer}>
                <Ionicons name="albums" size={16} color={theme.brand.accent} />
              </View>
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryValue}>
                  {dependencyEntries.length + devDependencyEntries.length}
                </Text>
                <Text style={styles.summaryLabel}>Total Packages</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Dependencies */}
      {dependencyEntries.length > 0 && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="cube" size={18} color={theme.brand.primary} />
            <Text style={styles.cardTitle}>Dependencies</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{dependencyEntries.length}</Text>
            </View>
          </View>
          <View style={styles.dependencyList}>
            {dependencyEntries.map(([name, version], index) => (
              <View key={index} style={styles.dependencyItem}>
                <View style={styles.dependencyInfo}>
                  <Ionicons name="cube-outline" size={14} color={theme.brand.primary} />
                  <Text style={styles.dependencyName}>{name}</Text>
                </View>
                <View style={styles.versionBadge}>
                  <Text style={styles.versionText}>{version}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Dev Dependencies */}
      {devDependencyEntries.length > 0 && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="construct" size={18} color={theme.brand.primary} />
            <Text style={styles.cardTitle}>Dev Dependencies</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{devDependencyEntries.length}</Text>
            </View>
          </View>
          <View style={styles.dependencyList}>
            {devDependencyEntries.map(([name, version], index) => (
              <View key={index} style={styles.dependencyItem}>
                <View style={styles.dependencyInfo}>
                  <Ionicons name="hammer-outline" size={14} color={theme.icon.secondary} />
                  <Text style={styles.dependencyName}>{name}</Text>
                </View>
                <View style={[styles.versionBadge, styles.versionBadgeDev]}>
                  <Text style={styles.versionText}>{version}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

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
  dependencyList: {
    gap: 8,
  },
  dependencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: theme.background.elevated,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.border.subtle,
    gap: 12,
  },
  dependencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  dependencyName: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.text.primary,
    letterSpacing: -0.1,
    flex: 1,
  },
  versionBadge: {
    backgroundColor: theme.background.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  versionBadgeDev: {
    backgroundColor: 'rgba(10, 132, 255, 0.15)',
  },
  versionText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.text.primary,
    fontFamily: 'monospace',
    letterSpacing: 0.2,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  summaryIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryInfo: {
    flex: 1,
    gap: 2,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.text.primary,
    letterSpacing: -0.3,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryDivider: {
    width: 1,
    height: 36,
    backgroundColor: theme.border.subtle,
    marginHorizontal: 8,
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
