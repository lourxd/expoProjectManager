import React from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {theme} from '../../../../theme/colors';

export default function SettingsTab() {
  return (
    <ScrollView
      style={styles.tabContent}
      contentContainerStyle={styles.tabContentContainer}
      showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Coming Soon</Text>
        </View>
        <Text style={styles.placeholderText}>
          Project settings will be displayed here
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabContent: {
    backgroundColor: theme.background.primary,
  },
  tabContentContainer: {
    paddingTop: 16,
    paddingBottom: 24,
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
  placeholderText: {
    fontSize: 14,
    color: theme.text.secondary,
    textAlign: 'center',
    paddingVertical: 20,
  },
});
