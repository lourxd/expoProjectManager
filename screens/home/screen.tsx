import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import ProjectScanner, {
  projectScannerEmitter,
  ScannedProject,
  ScanProgress,
} from '../../nativeModules/ProjectScanner';
import {db, $} from '../../db';
import {theme} from '../../theme/colors';
import FolderPicker from '../../nativeModules/FolderPicker';



const HomeScreen: React.FC = () => {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [currentScanPath, setCurrentScanPath] = useState<string>('');
  const [savedCount, setSavedCount] = useState(0);
  const [foundCount, setFoundCount] = useState(0);
  const [scannedCount, setScannedCount] = useState(0);

  useEffect(() => {
    loadSavedProjects();

    // Subscribe to scan progress events
    if (!projectScannerEmitter) {
      console.warn('ProjectScanner module not available');
      return;
    }

    const progressSubscription = projectScannerEmitter.addListener(
      'onScanProgress',
      (progress: ScanProgress) => {
        setCurrentScanPath(progress.currentPath);
        setScannedCount(prev => prev + 1);

        if (progress.type === 'found') {
          setFoundCount(prev => prev + 1);
        }
      }
    );

    // Subscribe to project found events
    const projectFoundSubscription = projectScannerEmitter.addListener(
      'onProjectFound',
      async (project: ScannedProject) => {
        // Save project to database immediately
        const now = new Date();
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
            folderSize: project.folderSize,
            projectSize: project.projectSize,
            dependencies: project.dependencies,
            devDependencies: project.devDependencies,
            orientation: project.orientation,
            platforms: project.platforms,
            backgroundColor: project.backgroundColor,
            primaryColor: project.primaryColor,
            bundleIdentifier: project.bundleIdentifier,
            androidPackage: project.androidPackage,
            permissions: project.permissions,
            splash: project.splash,
            updates: project.updates,
            plugins: project.plugins,
            extra: project.extra,
            createdAt: now,
            updatedAt: now,
          });
          // Update saved count immediately
          setSavedCount(prev => prev + 1);
        } catch (e) {
          // Skip duplicates (unique path constraint)
        }
      }
    );

    return () => {
      progressSubscription.remove();
      projectFoundSubscription.remove();
    };
  }, []);

  const loadSavedProjects = async () => {
    try {
      const projects = await db.select().from($.project);
      setSavedCount(projects.length);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleSelectFolder = async () => {
    try {
      const folderPath = await FolderPicker.pickFolder();
      if (folderPath) {
        setSelectedFolder(folderPath);
        setFoundCount(0);
        setScannedCount(0);
      }
    } catch (error) {
      console.error('Error selecting folder:', error);
    }
  };

  const handleScan = async () => {
    if (!selectedFolder) {
      return;
    }

    try {
      setIsScanning(true);
      setCurrentScanPath('');
      setFoundCount(0);
      setScannedCount(0);

      await ProjectScanner.scanFolder(selectedFolder);
    } catch (error) {
      console.error('Error scanning for Expo projects:', error);
    } finally {
      setIsScanning(false);
      setCurrentScanPath('');
    }
  };

  const handleStopScan = () => {
    Alert.alert(
      'Stop Scanning',
      'Are you sure you want to stop the current scan? Projects found so far will still be saved.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Stop Scan',
          style: 'destructive',
          onPress: async () => {
            try {
              await ProjectScanner.cancelScan();
            } catch (error) {
              console.error('Error stopping scan:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View style={styles.iconBadge}>
              <Ionicons
                name="rocket"
                size={24}
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

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name="search" size={16} color={theme.brand.primary} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{scannedCount}</Text>
                <Text style={styles.statLabel}>Scanned</Text>
              </View>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, {backgroundColor: 'rgba(48, 209, 88, 0.15)'}]}>
                <Ionicons name="checkmark-circle" size={16} color={theme.brand.accent} />
              </View>
              <View style={styles.statContent}>
                <Text style={[styles.statValue, {color: theme.brand.accent}]}>{foundCount}</Text>
                <Text style={styles.statLabel}>Found</Text>
              </View>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, {backgroundColor: 'rgba(48, 209, 88, 0.15)'}]}>
                <Ionicons name="cube" size={16} color={theme.icon.success} />
              </View>
              <View style={styles.statContent}>
                <Text style={[styles.statValue, {color: theme.icon.success}]}>{savedCount}</Text>
                <Text style={styles.statLabel}>Saved</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.content}>

        {/* Folder Selection Card */}
        <View style={styles.card}>
          <View style={styles.cardIcon}>
            <Ionicons name="folder-open" size={20} color={theme.brand.primary} />
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>Select Projects Folder</Text>
            <Text style={styles.cardDescription}>
              Choose the folder containing your Expo projects
            </Text>

            <Pressable
              style={({pressed}) => [
                styles.primaryButton,
                selectedFolder && styles.secondaryButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleSelectFolder}>
              <Ionicons
                name={selectedFolder ? 'folder' : 'folder-open'}
                size={16}
                color={selectedFolder ? theme.text.primary : '#FFFFFF'}
              />
              <Text style={[
                styles.primaryButtonText,
                selectedFolder && styles.secondaryButtonText
              ]}>
                {selectedFolder ? 'Change Folder' : 'Select Folder'}
              </Text>
            </Pressable>

            {selectedFolder && (
              <View style={styles.selectedFolderBadge}>
                <View style={styles.badgeIcon}>
                  <Ionicons name="checkmark-circle" size={12} color={theme.brand.accent} />
                </View>
                <Text style={styles.selectedFolderPath} numberOfLines={1}>
                  {selectedFolder}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Scan Card */}
        {selectedFolder && (
          <View style={styles.card}>
            <View style={styles.cardIcon}>
              <Ionicons name="search" size={20} color={theme.brand.primary} />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>Scan for Projects</Text>
              <Text style={styles.cardDescription}>
                Search the selected folder for Expo projects
              </Text>

              <View style={styles.buttonRow}>
                <Pressable
                  style={({pressed}) => [
                    styles.primaryButton,
                    isScanning && styles.scanningButton,
                    pressed && !isScanning && styles.buttonPressed,
                    isScanning && styles.flexButton,
                  ]}
                  onPress={handleScan}
                  disabled={isScanning}>
                  {isScanning ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Ionicons name="search" size={16} color="#FFFFFF" />
                  )}
                  <Text style={styles.primaryButtonText}>
                    {isScanning ? 'Scanning...' : 'Start Scan'}
                  </Text>
                </Pressable>

                {isScanning && (
                  <Pressable
                    style={({pressed}) => [
                      styles.stopButton,
                      pressed && styles.buttonPressed,
                    ]}
                    onPress={handleStopScan}>
                    <Ionicons name="stop-circle" size={16} color={theme.brand.error} />
                    <Text style={styles.stopButtonText}>Stop</Text>
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Active Scan Progress */}
        {isScanning && currentScanPath && (
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <ActivityIndicator size="small" color={theme.brand.primary} />
              <View style={styles.progressInfo}>
                <Text style={styles.progressTitle}>Scanning in progress</Text>
                <Text style={styles.progressSubtitle}>
                  {scannedCount} folders · {foundCount} projects found
                </Text>
              </View>
            </View>
            <View style={styles.progressPathContainer}>
              <Ionicons name="arrow-forward" size={10} color={theme.text.tertiary} />
              <Text style={styles.progressPath} numberOfLines={1}>
                {currentScanPath.replace('file://', '')}
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background.primary,
  },
  header: {
    backgroundColor: theme.background.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.border.default,
    paddingTop: 24,
    paddingBottom: 16,
  },
  headerContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
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
    fontSize: 24,
    fontWeight: '700',
    color: theme.text.primary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: theme.text.secondary,
    letterSpacing: -0.1,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: theme.background.elevated,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: 'rgba(10, 132, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContent: {
    gap: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.text.primary,
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: theme.border.subtle,
    marginHorizontal: 6,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  card: {
    backgroundColor: theme.background.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.border.default,
    padding: 18,
    flexDirection: 'row',
    gap: 14,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.background.elevated,
    borderWidth: 1,
    borderColor: theme.border.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
    gap: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.text.primary,
    letterSpacing: -0.3,
  },
  cardDescription: {
    fontSize: 13,
    color: theme.text.secondary,
    lineHeight: 18,
    marginTop: -6,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
  },
  primaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: theme.brand.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  flexButton: {
    flex: 1,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  secondaryButton: {
    backgroundColor: theme.background.elevated,
    borderWidth: 1,
    borderColor: theme.border.default,
  },
  secondaryButtonText: {
    color: theme.text.primary,
  },
  stopButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  stopButtonText: {
    color: theme.brand.error,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{scale: 0.98}],
  },
  scanningButton: {
    opacity: 0.8,
  },
  selectedFolderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: theme.background.elevated,
    borderWidth: 1,
    borderColor: theme.border.subtle,
    marginTop: 2,
  },
  badgeIcon: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedFolderPath: {
    flex: 1,
    fontSize: 11,
    fontFamily: 'monospace',
    color: theme.text.secondary,
  },
  progressCard: {
    backgroundColor: theme.background.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.border.default,
    padding: 16,
    marginHorizontal: 20,
    gap: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressInfo: {
    flex: 1,
    gap: 3,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.text.primary,
    letterSpacing: -0.2,
  },
  progressSubtitle: {
    fontSize: 12,
    color: theme.text.secondary,
    letterSpacing: -0.1,
  },
  progressPathContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10,
    borderRadius: 8,
    backgroundColor: theme.background.elevated,
  },
  progressPath: {
    flex: 1,
    fontSize: 10,
    fontFamily: 'monospace',
    color: theme.text.tertiary,
  },
});

export default React.memo(HomeScreen);
