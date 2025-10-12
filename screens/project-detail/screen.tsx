import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {theme} from '../../theme/colors';
import {db, $} from '../../db';
import {eq} from 'drizzle-orm';
import type {Project} from '../../db';
import ProjectHeader from './_components/ProjectHeader';
import QuickActions from './_components/QuickActions';

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

  const handleDelete = async () => {
    Alert.alert(
      'Remove Project',
      'Are you sure you want to remove this project from the database?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            if (project) {
              try {
                await db.delete($.project).where(eq($.project.id, project.id));
                Alert.alert('Success', 'Project removed from database');
              } catch (error) {
                console.error('Error deleting project:', error);
                Alert.alert('Error', 'Failed to remove project');
              }
            }
          },
        },
      ],
    );
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
    <ScrollView style={styles.container}>
      {/* Header */}
      <ProjectHeader project={project} />

      <QuickActions project={project}/>

      {/* Project Information */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Project Information</Text>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Ionicons
              name="document-text"
              size={16}
              color={theme.icon.secondary}
            />
            <Text style={styles.infoLabelText}>Name</Text>
          </View>
          <Text style={styles.infoValue}>
            {project.name || project.folderName}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Ionicons name="folder" size={16} color={theme.icon.secondary} />
            <Text style={styles.infoLabelText}>Folder Name</Text>
          </View>
          <Text style={styles.infoValue}>{project.folderName}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Ionicons
              name="folder-open"
              size={16}
              color={theme.icon.secondary}
            />
            <Text style={styles.infoLabelText}>Path</Text>
          </View>
          <Text style={styles.infoValue} numberOfLines={2}>
            {project.path}
          </Text>
        </View>

        {project.version && (
          <>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons
                  name="pricetag"
                  size={16}
                  color={theme.icon.secondary}
                />
                <Text style={styles.infoLabelText}>Version</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>v{project.version}</Text>
              </View>
            </View>
          </>
        )}

        {project.slug && (
          <>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="at" size={16} color={theme.icon.secondary} />
                <Text style={styles.infoLabelText}>Slug</Text>
              </View>
              <Text style={styles.infoValue}>{project.slug}</Text>
            </View>
          </>
        )}

        {project.scheme && (
          <>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="link" size={16} color={theme.icon.secondary} />
                <Text style={styles.infoLabelText}>Scheme</Text>
              </View>
              <Text style={styles.infoValue}>{project.scheme}</Text>
            </View>
          </>
        )}

        {project.sdkVersion && (
          <>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons
                  name="logo-react"
                  size={16}
                  color={theme.icon.secondary}
                />
                <Text style={styles.infoLabelText}>Expo SDK</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>SDK {project.sdkVersion}</Text>
              </View>
            </View>
          </>
        )}

        {project.usesNewArch !== undefined && project.usesNewArch !== null && (
          <>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons
                  name="construct"
                  size={16}
                  color={theme.icon.secondary}
                />
                <Text style={styles.infoLabelText}>New Architecture</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {project.usesNewArch ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
            </View>
          </>
        )}

        {project.size && (
          <>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons
                  name="server"
                  size={16}
                  color={theme.icon.secondary}
                />
                <Text style={styles.infoLabelText}>Size</Text>
              </View>
              <Text style={styles.infoValue}>{project.size}</Text>
            </View>
          </>
        )}

        {project.iconPath && (
          <>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="image" size={16} color={theme.icon.secondary} />
                <Text style={styles.infoLabelText}>Icon Path</Text>
              </View>
              <Text style={styles.infoValue} numberOfLines={1}>
                {project.iconPath.split('/').pop()}
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Timestamps */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Timestamps</Text>
        </View>

        {project.createdAt && (
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Ionicons
                name="add-circle"
                size={16}
                color={theme.icon.secondary}
              />
              <Text style={styles.infoLabelText}>Added</Text>
            </View>
            <Text style={styles.infoValue}>
              {new Date(project.createdAt).toLocaleString()}
            </Text>
          </View>
        )}

        {project.updatedAt && (
          <>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons
                  name="refresh-circle"
                  size={16}
                  color={theme.icon.secondary}
                />
                <Text style={styles.infoLabelText}>Updated</Text>
              </View>
              <Text style={styles.infoValue}>
                {new Date(project.updatedAt).toLocaleString()}
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Database & Actions */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Database</Text>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Ionicons name="key" size={16} color={theme.icon.secondary} />
            <Text style={styles.infoLabelText}>Project ID</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>#{project.id}</Text>
          </View>
        </View>
      </View>

      {/* Danger Zone */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Danger Zone</Text>
          <Text style={styles.cardDescription}>
            Remove this project from the database
          </Text>
        </View>
        <TouchableOpacity style={styles.dangerButton} onPress={handleDelete}>
          <View style={styles.dangerButtonContent}>
            <View style={styles.dangerIcon}>
              <Ionicons name="trash" size={18} color={theme.brand.error} />
            </View>
            <View style={styles.dangerInfo}>
              <Text style={styles.dangerButtonText}>Remove Project</Text>
              <Text style={styles.dangerButtonDescription}>
                Delete from database only
              </Text>
            </View>
          </View>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={theme.text.tertiary}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: theme.background.elevated,
    borderWidth: 1,
    borderColor: theme.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  projectIconLarge: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 32,
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
  cardDescription: {
    fontSize: 13,
    color: theme.text.secondary,
    lineHeight: 18,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderRadius: 12,
    backgroundColor: theme.background.elevated,
    borderWidth: 1,
    borderColor: theme.border.default,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: theme.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.text.primary,
    letterSpacing: -0.2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    gap: 16,
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  infoLabelText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text.secondary,
    letterSpacing: -0.1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.text.primary,
    letterSpacing: -0.1,
    textAlign: 'right',
    flex: 1,
  },
  badge: {
    backgroundColor: theme.background.elevated,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border.default,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.text.primary,
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: theme.border.subtle,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    backgroundColor: theme.background.elevated,
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 58, 0.2)',
  },
  dangerButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  dangerIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 69, 58, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerInfo: {
    flex: 1,
    gap: 2,
  },
  dangerButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.brand.error,
    letterSpacing: -0.2,
  },
  dangerButtonDescription: {
    fontSize: 12,
    color: theme.text.tertiary,
  },
});

export default React.memo(ProjectDetailScreen);
