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

export default function SettingsScreen(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedValue, setSelectedValue] = useState('apple');

  const textColor = isDarkMode ? '#ffffff' : '#000000';
  const cardBackground = isDarkMode ? '#2a2a2a' : '#ffffff';

  return (
    <ScrollView style={[styles.container, {backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5'}]}>
      <View style={styles.header}>
        <Text style={[styles.title, {color: textColor}]}>Settings</Text>
      </View>

      <View style={[styles.card, {backgroundColor: cardBackground}]}>
        <View style={styles.row}>
          <Text style={[styles.cardTitle, {color: textColor}]}>
            Toggle Switch
          </Text>
          <Switch
            value={isEnabled}
            onValueChange={setIsEnabled}
          />
        </View>
      </View>

      <View style={[styles.card, {backgroundColor: cardBackground}]}>
        <Text style={[styles.cardTitle, {color: textColor}]}>
          Selection Buttons
        </Text>
        <View style={styles.buttonGrid}>
          {['apple', 'banana', 'orange', 'grape', 'mango'].map((fruit) => (
            <TouchableOpacity
              key={fruit}
              style={[
                styles.selectButton,
                selectedValue === fruit && styles.selectButtonActive,
              ]}
              onPress={() => setSelectedValue(fruit)}
            >
              <Text
                style={[
                  styles.selectButtonText,
                  selectedValue === fruit && styles.selectButtonTextActive,
                ]}
              >
                {fruit.charAt(0).toUpperCase() + fruit.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.card, {backgroundColor: cardBackground}]}>
        <Text style={[styles.infoText, {color: textColor}]}>
          Selected: {selectedValue}
        </Text>
        <Text style={[styles.infoText, {color: textColor}]}>
          Switch: {isEnabled ? 'ON' : 'OFF'}
        </Text>
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
});
