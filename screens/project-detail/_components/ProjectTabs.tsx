import React, {useState} from 'react';
import {useWindowDimensions} from 'react-native';
import {TabView, SceneMap} from 'react-native-tab-view';
import ProjectInfoTab from './tabs/ProjectInfoTab';
import DetailsTab from './tabs/DetailsTab';
import SettingsTab from './tabs/SettingsTab';
import CustomTabBar from './CustomTabBar';

const routes = [
  {key: 'info', title: 'Info', icon: 'information-circle'},
  {key: 'details', title: 'Details', icon: 'analytics'},
  {key: 'settings', title: 'Settings', icon: 'settings'},
];

const renderScene = SceneMap({
  info: ProjectInfoTab,
  details: DetailsTab,
  settings: SettingsTab,
});

export default function ProjectTabs() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      renderTabBar={props => <CustomTabBar {...props} index={index} />}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
      animationEnabled={false}
      swipeEnabled={false}
    />
  );
}
