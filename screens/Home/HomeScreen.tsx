import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  TextInput,
} from 'react-native';

export default function HomeScreen(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [text, setText] = useState('');

  const textColor = isDarkMode ? '#ffffff' : '#000000';
  const cardBackground = isDarkMode ? '#2a2a2a' : '#ffffff';



  return (
    <ScrollView
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5'},
      ]}>
      <View style={styles.header}>
        <Text style={[styles.title, {color: textColor}]}>
          Home Screen
        </Text>
      </View>

      <View style={[styles.card, {backgroundColor: cardBackground}]}>
        <Text style={[styles.cardTitle, {color: textColor}]}>Text Input</Text>
        <TextInput
          style={[
            styles.input,
            {
              color: textColor,
              borderColor: isDarkMode ? '#444' : '#ddd',
            },
          ]}
          placeholder="Type something..."
          placeholderTextColor={isDarkMode ? '#888' : '#999'}
          value={text}
          onChangeText={setText}
        />
      </View>

      <View style={[styles.card, {backgroundColor: cardBackground}]}>
        <Text style={[styles.infoText, {color: textColor}]}>
          Welcome to React Navigation on macOS!
        </Text>
        <Text style={[styles.infoText, {color: textColor}]}>
          Try switching between tabs above.
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
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
  },
});
