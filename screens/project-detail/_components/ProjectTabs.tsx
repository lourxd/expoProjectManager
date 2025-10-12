import React, {useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {theme} from '../../../theme/colors';
import ProjectInfoTab from './tabs/ProjectInfoTab';
import DetailsTab from './tabs/DetailsTab';
import SettingsTab from './tabs/SettingsTab';

const tabs = [
  {key: 'info', title: 'Overview', icon: 'information-circle', component: ProjectInfoTab},
  {key: 'details', title: 'Configuration', icon: 'options', component: DetailsTab},
  {key: 'settings', title: 'Packages', icon: 'cube', component: SettingsTab},
];

export default function ProjectTabs() {
  const [activeTab, setActiveTab] = useState(0);

  const ActiveComponent = tabs[activeTab].component;

  return (
    <View style={styles.container}>
      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => {
          const isActive = activeTab === index;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tab}
              onPress={() => setActiveTab(index)}>
              <Ionicons
                name={tab.icon as any}
                size={18}
                color={isActive ? theme.brand.primary : theme.text.tertiary}
              />
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.title}
              </Text>
              {isActive && <View style={styles.indicator} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Tab Content */}
      <View style={styles.content}>
        <ActiveComponent />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: theme.border.subtle,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
    position: 'relative',
  },
  tabLabel: {
    fontWeight: '600',
    fontSize: 13,
    letterSpacing: -0.1,
    color: theme.text.tertiary,
  },
  tabLabelActive: {
    color: theme.brand.primary,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: theme.brand.primary,
  },
  content: {
    flex: 1,
  },
});
