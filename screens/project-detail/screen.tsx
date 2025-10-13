import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Animated,
  ActivityIndicator,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {theme} from '../../theme/colors';
import {db, $} from '../../db';
import {eq} from 'drizzle-orm';
import type {Project} from '../../db';
import {ProjectProvider} from '../../contexts/ProjectContext';
import ProjectHeader from './_components/ProjectHeader';
import ProjectTabs from './_components/ProjectTabs';
import ProjectScanner from '../../nativeModules/ProjectScanner';

type ProjectDetailScreenProps = {
  projectId: number;
};

const ProjectDetailScreen: React.FC<ProjectDetailScreenProps> = ({
  projectId,
}) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const bannerAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    loadProject();
  }, [projectId]);

  // Animate banner when isRefreshing changes
  useEffect(() => {
    if (isRefreshing) {
      // Slide down
      Animated.spring(bannerAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();
    } else {
      // Slide up
      Animated.spring(bannerAnim, {
        toValue: -50,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();
    }
  }, [isRefreshing]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const result = await db
        .select()
        .from($.project)
        .where(eq($.project.id, projectId))
        .limit(1);

      if (result.length > 0) {
        setProject(result[0]);
        // Start background scan immediately after loading (non-blocking)
        scanAndUpdateProject(result[0]);
      }
    } catch (error) {
      console.error('Error loading project:', error);
      Alert.alert('Error', 'Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const scanAndUpdateProject = async (currentProject: Project) => {
    try {
      setIsRefreshing(true);
      // Scan the specific project
      const scannedData = await ProjectScanner.scanSingleProject(currentProject.path);

      // Update the project in the database
      await db
        .update($.project)
        .set({
          name: scannedData.name,
          slug: scannedData.slug,
          scheme: scannedData.scheme,
          version: scannedData.version,
          sdkVersion: scannedData.sdkVersion,
          usesNewArch: scannedData.usesNewArch,
          iconPath: scannedData.iconPath,
          folderSize: scannedData.folderSize,
          projectSize: scannedData.projectSize,
          dependencies: scannedData.dependencies,
          devDependencies: scannedData.devDependencies,
          orientation: scannedData.orientation,
          platforms: scannedData.platforms,
          backgroundColor: scannedData.backgroundColor,
          primaryColor: scannedData.primaryColor,
          bundleIdentifier: scannedData.bundleIdentifier,
          androidPackage: scannedData.androidPackage,
          permissions: scannedData.permissions,
          splash: scannedData.splash,
          updates: scannedData.updates,
          plugins: scannedData.plugins,
          extra: scannedData.extra,
          updatedAt: new Date(),
        })
        .where(eq($.project.id, currentProject.id));

      // Reload the project to reflect changes
      const updatedResult = await db
        .select()
        .from($.project)
        .where(eq($.project.id, projectId))
        .limit(1);

      if (updatedResult.length > 0) {
        setProject(updatedResult[0]);
      }
    } catch (error) {
      console.error('Error scanning project:', error);
      // Don't show an alert here as it's a background operation
    } finally {
      setIsRefreshing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading project...</Text>
        </View>
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle" size={48} color={theme.brand.error} />
          <Text style={styles.errorText}>Project not found</Text>
        </View>
      </View>
    );
  }

  return (
    <ProjectProvider project={project}>
      <View style={styles.container}>
        {/* Refreshing Banner */}
        <Animated.View
          style={[
            styles.refreshBanner,
            {
              transform: [{translateY: bannerAnim}],
            },
          ]}>
          <View style={styles.refreshContent}>
            <ActivityIndicator size="small" color={theme.brand.primary} />
            <Text style={styles.refreshText}>Updating project data...</Text>
          </View>
        </Animated.View>

        {/* Header */}
        <ProjectHeader />

        {/* Tabs */}
        <ProjectTabs />
      </View>
    </ProjectProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background.primary,
  },
  refreshBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(10, 132, 255, 0.15)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(10, 132, 255, 0.3)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  refreshContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  refreshText: {
    fontSize: 12,
    color: theme.brand.primary,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: theme.text.secondary,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 18,
    color: theme.brand.error,
    fontWeight: '600',
    marginTop: 8,
  },
});

export default React.memo(ProjectDetailScreen);
