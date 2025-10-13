import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {theme} from '../../theme/colors';
import {db, $} from '../../db';

const SettingsScreen: React.FC = () => {
  const [autoScanOnStartup, setAutoScanOnStartup] = useState(false);
  const [showFileSizes, setShowFileSizes] = useState(true);
  const [includeHiddenFiles, setIncludeHiddenFiles] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [projectCount, setProjectCount] = useState(0);

  React.useEffect(() => {
    loadProjectCount();
  }, []);

  const loadProjectCount = async () => {
    try {
      const projects = await db.select().from($.project);
      setProjectCount(projects.length);
    } catch (error) {
      console.error('Error loading project count:', error);
    }
  };

  const handleClearDatabase = async () => {
    Alert.alert(
      'Clear Database',
      `Are you sure you want to clear all ${projectCount} projects from the database? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsClearing(true);
              await db.delete($.project);
              await loadProjectCount();
              Alert.alert('Success', 'Database cleared successfully');
            } catch (error) {
              console.error('Error clearing database:', error);
              Alert.alert('Error', 'Failed to clear database');
            } finally {
              setIsClearing(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>
          Manage your application preferences
        </Text>
      </View>

      {/* Scanner Preferences */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="settings" size={20} color={theme.brand.primary} />
          <Text style={styles.cardTitle}>Scanner Preferences</Text>
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <View style={styles.settingIcon}>
              <Ionicons name="play-circle" size={18} color={theme.icon.secondary} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Auto-scan on startup</Text>
              <Text style={styles.settingDescription}>
                Automatically scan for projects when app opens
              </Text>
            </View>
          </View>
          <Switch
            value={autoScanOnStartup}
            onValueChange={setAutoScanOnStartup}
            trackColor={{
              false: theme.border.default,
              true: theme.brand.primary,
            }}
            thumbColor={theme.text.primary}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <View style={styles.settingIcon}>
              <Ionicons name="eye-off" size={18} color={theme.icon.secondary} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Include hidden files</Text>
              <Text style={styles.settingDescription}>
                Scan directories that start with a dot
              </Text>
            </View>
          </View>
          <Switch
            value={includeHiddenFiles}
            onValueChange={setIncludeHiddenFiles}
            trackColor={{
              false: theme.border.default,
              true: theme.brand.primary,
            }}
            thumbColor={theme.text.primary}
          />
        </View>
      </View>

      {/* Display Preferences */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="color-palette" size={20} color={theme.brand.primary} />
          <Text style={styles.cardTitle}>Display Preferences</Text>
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <View style={styles.settingIcon}>
              <Ionicons name="resize" size={18} color={theme.icon.secondary} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Show file sizes</Text>
              <Text style={styles.settingDescription}>
                Display project and folder sizes in list
              </Text>
            </View>
          </View>
          <Switch
            value={showFileSizes}
            onValueChange={setShowFileSizes}
            trackColor={{
              false: theme.border.default,
              true: theme.brand.primary,
            }}
            thumbColor={theme.text.primary}
          />
        </View>
      </View>

      {/* Database Info */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="server" size={20} color={theme.brand.primary} />
          <Text style={styles.cardTitle}>Database Information</Text>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="cube" size={16} color={theme.brand.primary} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Total Projects</Text>
            <Text style={styles.infoValue}>{projectCount}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="folder" size={16} color={theme.icon.secondary} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Database Location</Text>
            <Text style={styles.infoValue}>Local SQLite</Text>
          </View>
        </View>
      </View>

      {/* Danger Zone */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="warning" size={20} color={theme.brand.error} />
          <Text style={[styles.cardTitle, {color: theme.brand.error}]}>Danger Zone</Text>
        </View>
        <Text style={styles.cardDescription}>
          Irreversible actions that affect your data
        </Text>

        <View style={styles.spacer} />

        <TouchableOpacity
          style={[styles.dangerButton, isClearing && styles.dangerButtonDisabled]}
          onPress={handleClearDatabase}
          disabled={isClearing}>
          <View style={styles.dangerButtonContent}>
            <View style={styles.dangerIcon}>
              <Ionicons name="trash" size={18} color={theme.brand.error} />
            </View>
            <View style={styles.dangerInfo}>
              <Text style={styles.dangerButtonText}>Clear All Projects</Text>
              <Text style={styles.dangerButtonDescription}>
                Remove all {projectCount} projects from database
              </Text>
            </View>
          </View>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={theme.text.tertiary}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background.primary,
  },
  header: {
    padding: 24,
    paddingTop: 32,
    paddingBottom: 20,
    gap: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.text.primary,
    letterSpacing: -1,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.text.primary,
    letterSpacing: -0.3,
    flex: 1,
  },
  cardDescription: {
    fontSize: 13,
    color: theme.text.secondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: theme.border.subtle,
    marginVertical: 12,
  },
  spacer: {
    height: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: theme.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingInfo: {
    flex: 1,
    gap: 2,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.text.primary,
    letterSpacing: -0.2,
  },
  settingDescription: {
    fontSize: 12,
    color: theme.text.tertiary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
    gap: 2,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.text.secondary,
    letterSpacing: -0.1,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.text.primary,
    letterSpacing: -0.2,
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
  dangerButtonDisabled: {
    opacity: 0.5,
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

export default React.memo(SettingsScreen);
