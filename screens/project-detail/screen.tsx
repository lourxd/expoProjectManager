import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {theme} from '../../theme/colors';
import {db, $} from '../../db';
import {eq} from 'drizzle-orm';
import type {Project} from '../../db';
import {ProjectProvider} from '../../contexts/ProjectContext';
import ProjectHeader from './_components/ProjectHeader';
import ProjectTabs from './_components/ProjectTabs';

type ProjectDetailScreenProps = {
  projectId: number;
};

const ProjectDetailScreen: React.FC<ProjectDetailScreenProps> = ({
  projectId,
}) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProject();
  }, [projectId]);

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
      }
    } catch (error) {
      console.error('Error loading project:', error);
      Alert.alert('Error', 'Failed to load project details');
    } finally {
      setLoading(false);
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
