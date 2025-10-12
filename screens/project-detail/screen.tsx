import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  Pressable,
} from 'react-native';
import {db, $} from '../../db';
import {eq} from 'drizzle-orm';
import type {Project} from '../../db';

type ProjectDetailScreenProps = {
  projectId: number;
};

const ProjectDetailScreen: React.FC<ProjectDetailScreenProps> = ({
  projectId,
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      const allProjects = await db.select().from($.project);
      const foundProject = allProjects.find(p => p.id === projectId);
      setProject(foundProject || null);
    } catch (error) {
      console.error('Error loading project:', error);
    }
  };

  const textColor = isDarkMode ? '#ffffff' : '#000000';
  const cardBackground = isDarkMode ? '#2a2a2a' : '#ffffff';

  const handleDelete = async () => {
    if (project) {
      try {
        await db.delete($.project).where(eq($.project.id, project.id));
        console.log('Project removed from database');
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  if (!project) {
    return (
      <View
        style={[
          styles.container,
          {backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5'},
        ]}>
        <View style={styles.header}>
          <Text style={[styles.title, {color: textColor}]}>
            Project Not Found
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5'},
      ]}>
      <View style={styles.header}>
        <Text style={[styles.title, {color: textColor}]}>{project.name}</Text>
      </View>

      <View style={[styles.card, {backgroundColor: cardBackground}]}>
        <Text style={[styles.cardTitle, {color: textColor}]}>
          Project Details
        </Text>
        <View style={styles.detailRow}>
          <Text style={[styles.label, {color: isDarkMode ? '#98989d' : '#6b7280'}]}>
            Path:
          </Text>
          <Text
            style={[styles.value, {color: textColor}, styles.pathText]}>
            {project.path}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.label, {color: isDarkMode ? '#98989d' : '#6b7280'}]}>
            ID:
          </Text>
          <Text style={[styles.value, {color: textColor}]}>{project.id}</Text>
        </View>
        {project.createdAt && (
          <View style={styles.detailRow}>
            <Text style={[styles.label, {color: isDarkMode ? '#98989d' : '#6b7280'}]}>
              Added:
            </Text>
            <Text style={[styles.value, {color: textColor}]}>
              {new Date(project.createdAt).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>

      <View style={[styles.card, {backgroundColor: cardBackground}]}>
        <Text style={[styles.cardTitle, {color: textColor}]}>Actions</Text>
        <Pressable
          style={({pressed}) => [
            styles.button,
            styles.deleteButton,
            {opacity: pressed ? 0.7 : 1},
          ]}
          onPress={handleDelete}>
          <Text style={styles.buttonText}>Remove Project</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 32,
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
    marginBottom: 16,
  },
  detailRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
  },
  pathText: {
    fontFamily: 'monospace',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: '#dc2626',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default React.memo(ProjectDetailScreen);
