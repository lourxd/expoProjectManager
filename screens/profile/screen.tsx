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
import {Ionicons} from '@expo/vector-icons';

const ProfileScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const textColor = isDarkMode ? '#ffffff' : '#000000';
  const cardBackground = isDarkMode ? '#2a2a2a' : '#ffffff';

  return (
    <ScrollView style={[styles.container, {backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5'}]}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Ionicons
            name="person-circle"
            size={32}
            color={isDarkMode ? '#0a7ea4' : '#007AFF'}
          />
          <Text style={[styles.title, {color: textColor}]}>Profile</Text>
        </View>
      </View>

      <View style={[styles.card, {backgroundColor: cardBackground}]}>
        <View style={styles.cardHeader}>
          <Ionicons
            name="finger-print"
            size={22}
            color={isDarkMode ? '#98989d' : '#6b7280'}
          />
          <Text style={[styles.cardTitle, {color: textColor}]}>
            Actions
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.actionButton, {borderColor: isDarkMode ? '#333' : '#e0e0e0'}]}
          onPress={() => console.log('Edit profile')}
        >
          <Ionicons
            name="create"
            size={20}
            color={isDarkMode ? '#0a7ea4' : '#007AFF'}
          />
          <Text style={[styles.actionButtonText, {color: textColor}]}>Edit Profile</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isDarkMode ? '#666' : '#999'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, {borderColor: isDarkMode ? '#333' : '#e0e0e0'}]}
          onPress={() => console.log('Change password')}
        >
          <Ionicons
            name="key"
            size={20}
            color={isDarkMode ? '#0a7ea4' : '#007AFF'}
          />
          <Text style={[styles.actionButtonText, {color: textColor}]}>Change Password</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isDarkMode ? '#666' : '#999'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, {borderColor: isDarkMode ? '#333' : '#e0e0e0'}]}
          onPress={() => console.log('Logout')}
        >
          <Ionicons
            name="log-out"
            size={20}
            color="#ef4444"
          />
          <Text style={[styles.actionButtonText, {color: '#ef4444'}]}>Log Out</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isDarkMode ? '#666' : '#999'}
          />
        </TouchableOpacity>
      </View>

      <View style={[styles.card, {backgroundColor: cardBackground}]}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons
              name="code-slash"
              size={24}
              color={isDarkMode ? '#0a7ea4' : '#007AFF'}
            />
            <Text style={[styles.statNumber, {color: textColor}]}>12</Text>
            <Text style={[styles.statLabel, {color: isDarkMode ? '#98989d' : '#6b7280'}]}>
              Projects
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons
              name="git-commit"
              size={24}
              color={isDarkMode ? '#0a7ea4' : '#007AFF'}
            />
            <Text style={[styles.statNumber, {color: textColor}]}>248</Text>
            <Text style={[styles.statLabel, {color: isDarkMode ? '#98989d' : '#6b7280'}]}>
              Commits
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons
              name="star"
              size={24}
              color={isDarkMode ? '#0a7ea4' : '#007AFF'}
            />
            <Text style={[styles.statNumber, {color: textColor}]}>56</Text>
            <Text style={[styles.statLabel, {color: isDarkMode ? '#98989d' : '#6b7280'}]}>
              Stars
            </Text>
          </View>
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
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
    gap: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
  },
});

export default React.memo(ProfileScreen);
