import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  Button,
  TouchableOpacity,
} from 'react-native';

export default function ProfileScreen(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const textColor = isDarkMode ? '#ffffff' : '#000000';
  const cardBackground = isDarkMode ? '#2a2a2a' : '#ffffff';

  return (
    <ScrollView style={[styles.container, {backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5'}]}>
      <View style={styles.header}>
        <Text style={[styles.title, {color: textColor}]}>Profile</Text>
      </View>

      <View style={[styles.card, {backgroundColor: cardBackground}]}>
        <Text style={[styles.cardTitle, {color: textColor, marginBottom: 16}]}>
          Buttons
        </Text>
        <Button title="Press Me" onPress={() => console.log('Button pressed')} />
        <View style={{height: 12}} />
        <TouchableOpacity
          style={styles.customButton}
          onPress={() => console.log('Custom button pressed')}
        >
          <Text style={styles.customButtonText}>Custom Button</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, {backgroundColor: cardBackground}]}>
        <Text style={[styles.infoText, {color: textColor}]}>
          This is the profile screen with some actions.
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
  customButton: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    gap: 8,
  },
  customButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
  },
});
