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
  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedValue, setSelectedValue] = useState('apple');
  const [isClearing, setIsClearing] = useState(false);

  const handleClearDatabase = async () => {
    Alert.alert(
      'Clear Database',
      'Are you sure you want to clear all projects from the database? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsClearing(true);
              await db.delete($.project);
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
        <View style={styles.headerRow}>
          <View style={styles.iconBadge}>
            <Ionicons
              name="settings-sharp"
              size={28}
              color={theme.brand.primary}
            />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>
              Customize your experience
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Preferences</Text>
        </View>
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <View style={styles.settingIcon}>
              <Ionicons
                name="notifications"
                size={18}
                color={theme.icon.secondary}
              />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive project updates
              </Text>
            </View>
          </View>
          <Switch
            value={isEnabled}
            onValueChange={setIsEnabled}
            trackColor={{
              false: theme.border.default,
              true: theme.brand.primary,
            }}
            thumbColor={theme.text.primary}
          />
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Theme Selection</Text>
          <Text style={styles.cardDescription}>
            Choose your preferred theme
          </Text>
        </View>
        <View style={styles.buttonGrid}>
          {[
            {value: 'apple', icon: 'logo-apple' as const, label: 'Apple'},
            {value: 'banana', icon: 'nutrition' as const, label: 'Banana'},
            {value: 'orange', icon: 'sunny' as const, label: 'Orange'},
            {value: 'grape', icon: 'leaf' as const, label: 'Grape'},
            {value: 'mango', icon: 'heart' as const, label: 'Mango'},
          ].map(({value, icon, label}) => (
            <TouchableOpacity
              key={value}
              style={[
                styles.selectButton,
                selectedValue === value && styles.selectButtonActive,
              ]}
              onPress={() => setSelectedValue(value)}>
              <Ionicons
                name={icon}
                size={16}
                color={
                  selectedValue === value
                    ? theme.text.primary
                    : theme.text.tertiary
                }
              />
              <Text
                style={[
                  styles.selectButtonText,
                  selectedValue === value && styles.selectButtonTextActive,
                ]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Status</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons
            name="information-circle"
            size={18}
            color={theme.brand.primary}
          />
          <Text style={styles.infoText}>Selected: {selectedValue}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons
            name={isEnabled ? 'checkbox' : 'square-outline'}
            size={18}
            color={isEnabled ? theme.brand.accent : theme.text.tertiary}
          />
          <Text style={styles.infoText}>
            Notifications: {isEnabled ? 'ON' : 'OFF'}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Danger Zone</Text>
          <Text style={styles.cardDescription}>
            Irreversible actions that affect your data
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.dangerButton, isClearing && styles.dangerButtonDisabled]}
          onPress={handleClearDatabase}
          disabled={isClearing}>
          <View style={styles.dangerButtonContent}>
            <View style={styles.dangerIcon}>
              <Ionicons name="trash" size={18} color={theme.brand.error} />
            </View>
            <View style={styles.dangerInfo}>
              <Text style={styles.dangerButtonText}>Clear Database</Text>
              <Text style={styles.dangerButtonDescription}>
                Remove all projects from database
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
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: theme.background.elevated,
    borderWidth: 1,
    borderColor: theme.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 28,
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
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.border.default,
    backgroundColor: theme.background.elevated,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectButtonActive: {
    backgroundColor: theme.brand.primary,
    borderColor: theme.brand.primary,
  },
  selectButtonText: {
    fontSize: 14,
    color: theme.text.tertiary,
    fontWeight: '500',
  },
  selectButtonTextActive: {
    color: theme.text.primary,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  infoText: {
    fontSize: 14,
    color: theme.text.secondary,
    fontWeight: '500',
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
