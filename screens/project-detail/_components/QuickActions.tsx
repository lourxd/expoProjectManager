import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  NativeModules,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Project } from '../../../db';
import { theme } from '../../../theme/colors';
const {CommandRunner} = NativeModules;

export default function QuickActions({project}: {project: Project}) {
  const open = async () => {
    await CommandRunner.run(`open -a "Terminal" ${project.path}`);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
      </View>
      <View style={styles.actionsGrid}>
        <TouchableOpacity style={styles.actionButton} onPress={open}>
          <View style={styles.actionIcon}>
            <Ionicons name="terminal" size={20} color={theme.brand.primary} />
          </View>
          <Text style={styles.actionText}>Terminal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => console.log('Open in Finder')}>
          <View style={styles.actionIcon}>
            <Ionicons name="folder-open" size={20} color={theme.icon.success} />
          </View>
          <Text style={styles.actionText}>Finder</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => console.log('Run Project')}>
          <View style={styles.actionIcon}>
            <Ionicons name="play" size={20} color={theme.brand.accent} />
          </View>
          <Text style={styles.actionText}>Run</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => console.log('View in VSCode')}>
          <View style={styles.actionIcon}>
            <Ionicons name="code-slash" size={20} color={theme.brand.warning} />
          </View>
          <Text style={styles.actionText}>VSCode</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background.primary,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: theme.text.secondary,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 18,
    color: theme.brand.error,
    fontWeight: '600',
    marginTop: 8,
  },
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
  cardDescription: {
    fontSize: 13,
    color: theme.text.secondary,
    lineHeight: 18,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderRadius: 12,
    backgroundColor: theme.background.elevated,
    borderWidth: 1,
    borderColor: theme.border.default,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: theme.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.text.primary,
    letterSpacing: -0.2,
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
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    backgroundColor: theme.background.elevated,
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 58, 0.2)',
  },
  dangerButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  dangerIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 69, 58, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerInfo: {
    flex: 1,
    gap: 2,
  },
  dangerButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.brand.error,
    letterSpacing: -0.2,
  },
  dangerButtonDescription: {
    fontSize: 12,
    color: theme.text.tertiary,
  },
});
