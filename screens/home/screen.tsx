import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  Pressable,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {
  scanForExpoProjects,
  getDefaultSearchPaths,
  ScanProgress,
} from '../../utils/expoProjectScanner';
import {db, $} from '../../db';

const HomeScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [expoProjects, setExpoProjects] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [currentScanPath, setCurrentScanPath] = useState<string>('');
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    loadSavedProjects();
  }, []);

  const loadSavedProjects = async () => {
    try {
      const projects = await db.select().from($.project);
      setSavedCount(projects.length);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const textColor = isDarkMode ? '#ffffff' : '#000000';
  const cardBackground = isDarkMode ? '#2a2a2a' : '#ffffff';

  const handleScan = async () => {
    try {
      setIsScanning(true);
      setExpoProjects([]);
      setCurrentScanPath('');

      const searchPaths = getDefaultSearchPaths('lou');

      const projects = await scanForExpoProjects(
        searchPaths,
        (progress: ScanProgress) => {
          setCurrentScanPath(progress.currentPath);
          // Update UI with current progress
          if (progress.foundCount > 0) {
            console.log(`Progress: ${progress.currentPath} (${progress.foundCount} found)`);
          }
        }
      );

      setExpoProjects(projects);

      // Save projects to database
      console.log(`💾 Saving ${projects.length} projects to database...`);
      const now = new Date();

      for (const projectPath of projects) {
        try {
          const cleanPath = projectPath.replace('file://', '');
          const name = cleanPath.split('/').pop() || 'Unknown Project';

          await db.insert($.project).values({
            name,
            path: cleanPath,
            createdAt: now,
            updatedAt: now,
          });
        } catch (e) {
          // Skip duplicates
        }
      }

      await loadSavedProjects();
      console.log('✓ Projects saved to database');
    } catch (error) {
      console.error('Error scanning for Expo projects:', error);
    } finally {
      setIsScanning(false);
      setCurrentScanPath('');
    }
  };

  return (
    <ScrollView
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5'},
      ]}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Ionicons
            name="folder-open"
            size={32}
            color={isDarkMode ? '#0a7ea4' : '#007AFF'}
          />
          <Text style={[styles.title, {color: textColor}]}>
            Expo Project Manager
          </Text>
        </View>
        <Text
          style={[
            styles.subtitle,
            {color: isDarkMode ? '#98989d' : '#6b7280'},
          ]}>
          Scan and manage your Expo projects
        </Text>
      </View>

      <View style={[styles.card, {backgroundColor: cardBackground}]}>
        <Text style={[styles.cardTitle, {color: textColor}]}>
          Expo Project Scanner
        </Text>
        <Pressable
          style={({pressed}) => [
            styles.button,
            {
              backgroundColor: isDarkMode ? '#0a7ea4' : '#007AFF',
              opacity: pressed ? 0.7 : 1,
            },
          ]}
          onPress={handleScan}
          disabled={isScanning}>
          <Ionicons
            name={isScanning ? 'sync' : 'search'}
            size={20}
            color="#ffffff"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>
            {isScanning ? 'Scanning...' : 'Scan for Expo Projects'}
          </Text>
        </Pressable>
        {isScanning && currentScanPath && (
          <Text
            style={[styles.scanProgress, {color: isDarkMode ? '#999' : '#666'}]}
            numberOfLines={1}>
            {currentScanPath.replace('file://', '')}
          </Text>
        )}
        <Text style={[styles.infoText, {color: textColor, marginTop: 12}]}>
          {isScanning
            ? 'Searching your system for Expo projects...'
            : `Found ${expoProjects.length} project(s) • ${savedCount} saved in database`}
        </Text>

        {expoProjects.length > 0 && (
          <View style={styles.projectList}>
            {expoProjects.map((project, index) => (
              <View
                key={index}
                style={[
                  styles.projectItem,
                  {
                    backgroundColor: isDarkMode ? '#1a1a1a' : '#f9f9f9',
                    borderColor: isDarkMode ? '#333' : '#e0e0e0',
                  },
                ]}>
                <Ionicons
                  name="logo-react"
                  size={20}
                  color={isDarkMode ? '#61dafb' : '#007AFF'}
                  style={styles.projectIcon}
                />
                <Text style={[styles.projectPath, {color: textColor}]}>
                  {project.replace('file://', '')}
                </Text>
              </View>
            ))}
          </View>
        )}
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
  subtitle: {
    fontSize: 15,
    marginTop: 4,
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
  infoText: {
    fontSize: 14,
    marginBottom: 8,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  buttonIcon: {
    marginRight: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  projectList: {
    marginTop: 16,
    gap: 8,
  },
  projectItem: {
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  projectIcon: {
    marginRight: 4,
  },
  projectPath: {
    fontSize: 13,
    fontFamily: 'monospace',
    flex: 1,
  },
  scanProgress: {
    fontSize: 11,
    fontFamily: 'monospace',
    marginTop: 8,
  },
});

export default React.memo(HomeScreen);
