import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  Switch,
  TouchableOpacity,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

const SettingsScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedValue, setSelectedValue] = useState('apple');

  const textColor = isDarkMode ? '#ffffff' : '#000000';
  const cardBackground = isDarkMode ? '#2a2a2a' : '#ffffff';

  return (
    <ScrollView style={[styles.container, {backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5'}]}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Ionicons
            name="settings"
            size={28}
            color={isDarkMode ? '#0a7ea4' : '#007AFF'}
          />
          <Text style={[styles.title, {color: textColor}]}>Settings</Text>
        </View>
      </View>

      <View style={[styles.card, {backgroundColor: cardBackground}]}>
        <View style={styles.row}>
          <View style={styles.settingLeft}>
            <Ionicons
              name="notifications"
              size={22}
              color={isDarkMode ? '#98989d' : '#6b7280'}
            />
            <Text style={[styles.cardTitle, {color: textColor}]}>
              Notifications
            </Text>
          </View>
          <Switch
            value={isEnabled}
            onValueChange={setIsEnabled}
          />
        </View>
      </View>

      <View style={[styles.card, {backgroundColor: cardBackground}]}>
        <View style={styles.settingLeft}>
          <Ionicons
            name="color-palette"
            size={22}
            color={isDarkMode ? '#98989d' : '#6b7280'}
          />
          <Text style={[styles.cardTitle, {color: textColor}]}>
            Theme Selection
          </Text>
        </View>
        <View style={styles.buttonGrid}>
          {[
            {value: 'apple', icon: 'logo-apple'},
            {value: 'banana', icon: 'nutrition'},
            {value: 'orange', icon: 'sunny'},
            {value: 'grape', icon: 'leaf'},
            {value: 'mango', icon: 'heart'}
          ].map(({value, icon}) => (
            <TouchableOpacity
              key={value}
              style={[
                styles.selectButton,
                selectedValue === value && styles.selectButtonActive,
              ]}
              onPress={() => setSelectedValue(value)}
            >
              <Ionicons
                name={icon}
                size={16}
                color={selectedValue === value ? '#ffffff' : '#6b7280'}
              />
              <Text
                style={[
                  styles.selectButtonText,
                  selectedValue === value && styles.selectButtonTextActive,
                ]}
              >
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.card, {backgroundColor: cardBackground}]}>
        <View style={styles.infoRow}>
          <Ionicons
            name="information-circle"
            size={20}
            color={isDarkMode ? '#0a7ea4' : '#007AFF'}
          />
          <Text style={[styles.infoText, {color: textColor}]}>
            Selected: {selectedValue}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons
            name={isEnabled ? 'checkbox' : 'square-outline'}
            size={20}
            color={isDarkMode ? '#0a7ea4' : '#007AFF'}
          />
          <Text style={[styles.infoText, {color: textColor}]}>
            Notifications: {isEnabled ? 'ON' : 'OFF'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  selectButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  selectButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  selectButtonTextActive: {
    color: '#ffffff',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default React.memo(SettingsScreen);
