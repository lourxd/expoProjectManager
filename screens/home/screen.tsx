import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {
  scanForExpoProjects,
  getDefaultSearchPaths,
  ScanProgress,
  ProjectMetadata,
} from '../../utils/expoProjectScanner';
import {db, $} from '../../db';
import {theme} from '../../theme/colors';

interface LogEntry {
  id: number;
  type: 'scanning' | 'found' | 'skipped' | 'processing' | 'info';
  message: string;
  path?: string;
  timestamp: Date;
}



const HomeScreen: React.FC = () => {
  const [expoProjects, setExpoProjects] = useState<ProjectMetadata[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [currentScanPath, setCurrentScanPath] = useState<string>('');
  const [savedCount, setSavedCount] = useState(0);
  const [scanLogs, setScanLogs] = useState<LogEntry[]>([]);

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


  const addLog = (type: LogEntry['type'], message: string, path?: string) => {
    setScanLogs(prev => {
      const newId = prev.length > 0 ? Math.max(...prev.map(l => l.id)) + 1 : 0;
      const newLog: LogEntry = {
        id: newId,
        type,
        message,
        path,
        timestamp: new Date(),
      };
      // Keep only last 50 logs to avoid memory issues
      const updated = [...prev, newLog];
      return updated.slice(-50);
    });
  };

  const handleScan = async () => {
    try {
      setIsScanning(true);
      setExpoProjects([]);
      setCurrentScanPath('');
      setScanLogs([]);

      addLog('info', 'Starting scan...', '');

      const searchPaths = getDefaultSearchPaths('lou');
      addLog('info', `Scanning ${searchPaths.length} directories`, '');

      const projects = await scanForExpoProjects(
        searchPaths,
        (progress: ScanProgress) => {
          setCurrentScanPath(progress.currentPath);

          // Add detailed log entry based on type
          if (progress.type === 'found') {
            addLog('found', progress.message || 'Found project', progress.currentPath);
          } else if (progress.type === 'skipped') {
            addLog('skipped', progress.message || 'Skipped project', progress.currentPath);
          }
          // Don't log every scanning event as it's too verbose
        }
      );

      setExpoProjects(projects);
      addLog('info', `Scan complete! Found ${projects.length} Expo projects`, '');

      // Save projects to database with all metadata
      if (projects.length > 0) {
        addLog('processing', `Saving ${projects.length} projects to database...`, '');
      }

      const now = new Date();
      let savedSuccessfully = 0;

      for (const project of projects) {
        try {
          await db.insert($.project).values({
            folderName: project.folderName,
            name: project.name,
            slug: project.slug,
            scheme: project.scheme,
            path: project.path,
            usesNewArch: project.usesNewArch,
            iconPath: project.iconPath,
            sdkVersion: project.sdkVersion,
            version: project.version,
            size: project.size,
            createdAt: now,
            updatedAt: now,
          });
          savedSuccessfully++;
        } catch (e) {
          // Skip duplicates
          addLog('info', `Already in database: ${project.name || project.folderName}`, project.path);
        }
      }

      await loadSavedProjects();
      if (savedSuccessfully > 0) {
        addLog('info', `✓ Saved ${savedSuccessfully} new projects to database`, '');
      }
    } catch (error) {
      console.error('Error scanning for Expo projects:', error);
      addLog('info', `Error: ${error}`, '');
    } finally {
      setIsScanning(false);
      setCurrentScanPath('');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.iconBadge}>
            <Ionicons
              name="folder-open"
              size={28}
              color={theme.brand.primary}
            />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>Project Scanner</Text>
            <Text style={styles.subtitle}>
              Discover and manage your Expo projects
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="apps" size={20} color={theme.brand.primary} />
          <Text style={styles.statValue}>{expoProjects.length}</Text>
          <Text style={styles.statLabel}>Found</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="save" size={20} color={theme.brand.accent} />
          <Text style={styles.statValue}>{savedCount}</Text>
          <Text style={styles.statLabel}>Saved</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Scan Projects</Text>
          <Text style={styles.cardDescription}>
            Search your file system for Expo projects
          </Text>
        </View>
        <Pressable
          style={({pressed}) => [
            styles.button,
            {opacity: pressed ? 0.8 : 1},
            isScanning && styles.buttonScanning,
          ]}
          onPress={handleScan}
          disabled={isScanning}>
          <Ionicons
            name={isScanning ? 'sync' : 'search'}
            size={20}
            color={theme.text.primary}
          />
          <Text style={styles.buttonText}>
            {isScanning ? 'Scanning...' : 'Start Scan'}
          </Text>
        </Pressable>
        {isScanning && currentScanPath && (
          <View style={styles.scanProgressContainer}>
            <Text style={styles.scanProgressLabel}>Currently Scanning:</Text>
            <Text style={styles.scanProgress} numberOfLines={1}>
              {currentScanPath.replace('file://', '')}
            </Text>
          </View>
        )}
      </View>

      {/* Scan Logs */}
      {scanLogs.length > 0 && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Scan Activity Log</Text>
            <Text style={styles.cardDescription}>
              Real-time updates during scanning
            </Text>
          </View>
          <View style={styles.logContainer}>
            {scanLogs.slice().reverse().map((log) => (
              <View key={log.id} style={styles.logEntry}>
                <View style={[
                  styles.logIcon,
                  log.type === 'found' && styles.logIconFound,
                  log.type === 'skipped' && styles.logIconSkipped,
                  log.type === 'info' && styles.logIconInfo,
                  log.type === 'processing' && styles.logIconProcessing,
                ]}>
                  <Ionicons
                    name={
                      log.type === 'found' ? 'checkmark-circle' :
                      log.type === 'skipped' ? 'close-circle' :
                      log.type === 'processing' ? 'sync' :
                      'information-circle'
                    }
                    size={16}
                    color={
                      log.type === 'found' ? theme.brand.accent :
                      log.type === 'skipped' ? theme.text.muted :
                      log.type === 'processing' ? theme.brand.warning :
                      theme.brand.primary
                    }
                  />
                </View>
                <View style={styles.logContent}>
                  <Text style={styles.logMessage}>{log.message}</Text>
                  {log.path && (
                    <Text style={styles.logPath} numberOfLines={1}>
                      {log.path.replace('file://', '')}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {expoProjects.length > 0 && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              Found Projects ({expoProjects.length})
            </Text>
            <Text style={styles.cardDescription}>
              Recently discovered Expo projects
            </Text>
          </View>
          <View style={styles.projectList}>
            {expoProjects.map((project, index) => (
              <View key={index} style={styles.projectItem}>
                <View style={styles.projectIconContainer}>
                  <Ionicons
                    name="logo-react"
                    size={24}
                    color={theme.brand.primary}
                  />
                </View>
                <View style={styles.projectInfo}>
                  <Text style={styles.projectName}>
                    {project.name || project.folderName}
                  </Text>
                  <Text style={styles.projectPath} numberOfLines={1}>
                    {project.path}
                  </Text>
                  <View style={styles.projectMeta}>
                    {project.version && (
                      <View style={styles.metaBadge}>
                        <Ionicons
                          name="pricetag"
                          size={10}
                          color={theme.text.tertiary}
                        />
                        <Text style={styles.metaText}>v{project.version}</Text>
                      </View>
                    )}
                    {project.sdkVersion && (
                      <View style={styles.metaBadge}>
                        <Ionicons
                          name="cube"
                          size={10}
                          color={theme.text.tertiary}
                        />
                        <Text style={styles.metaText}>SDK {project.sdkVersion}</Text>
                      </View>
                    )}
                    {project.size && (
                      <View style={styles.metaBadge}>
                        <Ionicons
                          name="folder-outline"
                          size={10}
                          color={theme.text.tertiary}
                        />
                        <Text style={styles.metaText}>{project.size}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.background.card,
    borderWidth: 1,
    borderColor: theme.border.default,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
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
  cardDescription: {
    fontSize: 13,
    color: theme.text.secondary,
    lineHeight: 18,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: theme.brand.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonScanning: {
    opacity: 0.7,
  },
  buttonText: {
    color: theme.text.primary,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  scanProgressContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: theme.background.elevated,
    borderWidth: 1,
    borderColor: theme.border.subtle,
    gap: 4,
  },
  scanProgressLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scanProgress: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: theme.text.secondary,
  },
  projectList: {
    gap: 12,
    marginTop: 16,
  },
  projectItem: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 12,
    backgroundColor: theme.background.elevated,
    borderWidth: 1,
    borderColor: theme.border.subtle,
    gap: 12,
  },
  projectIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: theme.background.secondary,
    borderWidth: 1,
    borderColor: theme.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  projectInfo: {
    flex: 1,
    gap: 6,
  },
  projectName: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.text.primary,
    letterSpacing: -0.2,
  },
  projectPath: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: theme.text.tertiary,
  },
  projectMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: theme.background.secondary,
  },
  metaText: {
    fontSize: 11,
    fontWeight: '500',
    color: theme.text.secondary,
  },
  logContainer: {
    gap: 8,
    maxHeight: 300,
  },
  logEntry: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: theme.background.elevated,
    borderWidth: 1,
    borderColor: theme.border.subtle,
  },
  logIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logIconFound: {
    backgroundColor: 'rgba(48, 209, 88, 0.1)',
  },
  logIconSkipped: {
    backgroundColor: 'rgba(74, 74, 74, 0.1)',
  },
  logIconInfo: {
    backgroundColor: 'rgba(10, 132, 255, 0.1)',
  },
  logIconProcessing: {
    backgroundColor: 'rgba(255, 159, 10, 0.1)',
  },
  logContent: {
    flex: 1,
    gap: 2,
  },
  logMessage: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.text.primary,
    letterSpacing: -0.2,
  },
  logPath: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: theme.text.tertiary,
  },
});

export default React.memo(HomeScreen);
