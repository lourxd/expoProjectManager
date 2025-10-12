import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {theme} from '../../theme/colors';

export const Logo: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Expo Manager</Text>
        <Text style={styles.subtitle}>Project Dashboard</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: theme.border.subtle,
  },
  textContainer: {
    gap: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.text.primary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.text.tertiary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
