import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {theme} from '../../theme/colors';

const ProfileScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.iconBadge}>
            <Ionicons
              name="person-circle"
              size={28}
              color={theme.brand.primary}
            />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.subtitle}>
              Manage your account
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Actions</Text>
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => console.log('Edit profile')}>
          <View style={styles.actionLeft}>
            <View style={styles.actionIcon}>
              <Ionicons name="create" size={18} color={theme.icon.brand} />
            </View>
            <Text style={styles.actionText}>Edit Profile</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={theme.text.tertiary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => console.log('Change password')}>
          <View style={styles.actionLeft}>
            <View style={styles.actionIcon}>
              <Ionicons name="key" size={18} color={theme.icon.brand} />
            </View>
            <Text style={styles.actionText}>Change Password</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={theme.text.tertiary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => console.log('Logout')}>
          <View style={styles.actionLeft}>
            <View style={[styles.actionIcon, styles.actionIconDanger]}>
              <Ionicons name="log-out" size={18} color={theme.brand.error} />
            </View>
            <Text style={[styles.actionText, styles.actionTextDanger]}>
              Log Out
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={theme.text.tertiary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Statistics</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Ionicons
                name="code-slash"
                size={24}
                color={theme.brand.primary}
              />
            </View>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Projects</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Ionicons
                name="git-commit"
                size={24}
                color={theme.brand.secondary}
              />
            </View>
            <Text style={styles.statNumber}>248</Text>
            <Text style={styles.statLabel}>Commits</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Ionicons name="star" size={24} color={theme.brand.accent} />
            </View>
            <Text style={styles.statNumber}>56</Text>
            <Text style={styles.statLabel}>Stars</Text>
          </View>
        </View>
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
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    backgroundColor: theme.background.elevated,
    marginBottom: 8,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: theme.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconDanger: {
    backgroundColor: 'rgba(255, 69, 58, 0.1)',
  },
  actionText: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.text.primary,
    letterSpacing: -0.2,
  },
  actionTextDanger: {
    color: theme.brand.error,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  statItem: {
    alignItems: 'center',
    gap: 12,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: theme.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.text.primary,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default React.memo(ProfileScreen);
