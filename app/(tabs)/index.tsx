import React from 'react';
import { ScrollView, StyleSheet, View, Image, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/common/Card';
import { Typography } from '@/components/common/Typography';
import { Button } from '@/components/common/Button';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { diagnoses, serviceCategories, maintenanceTips } from '@/utils/mockData';
import { Search, Plus, Bell, ArrowRight, Calendar, Wrench } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTranslation } from '@/utils/i18n';

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { t } = useTranslation();

  const handleViewAllDiagnoses = () => {
    router.navigate('/(tabs)/diagnosis');
  };
  
  const handleViewAllProfessionals = () => {
    router.navigate('/(tabs)/professionals');
  };

  const handleNewDiagnosis = () => {
    router.navigate('/(tabs)/diagnosis');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Typography variant="h4" weight="bold">FixFinder</Typography>
          <Typography variant="body2" color="secondary">{t('whatNeedsFixing')}</Typography>
        </View>
        <View style={styles.headerActions}>
          <View style={[styles.iconButton, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Search size={20} color={colors.text} />
          </View>
          <View style={[styles.iconButton, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Bell size={20} color={colors.text} />
          </View>
        </View>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <Card style={styles.heroCard}>
            <Typography variant="h5" weight="bold" style={styles.heroTitle}>
              {t('needRepairExpert')}
            </Typography>
            <Typography variant="body2" color="secondary" style={styles.heroSubtitle}>
              {t('browseNetwork')}
            </Typography>
            <Button
              title={t('startNewDiagnosis')}
              onPress={handleNewDiagnosis}
              leftIcon={<Plus size={16} color="white" />}
              style={styles.heroButton}
            />
          </Card>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Typography variant="h5" weight="bold">{t('recentDiagnoses')}</Typography>
            <Button
              title={t('viewAll')}
              variant="ghost"
              size="sm"
              onPress={handleViewAllDiagnoses}
              rightIcon={<ArrowRight size={16} color={colors.primary[500]} />}
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentDiagnosesContent}
          >
            {diagnoses.map((diagnosis) => (
              <Card key={diagnosis.id} style={styles.diagnosisCard} onPress={() => router.navigate(`/(tabs)/diagnosis/${diagnosis.id}`)}>
                <Image source={{ uri: diagnosis.imageUrl }} style={styles.diagnosisImage} />
                <View style={styles.diagnosisInfo}>
                  <Typography variant="h6" weight="medium" numberOfLines={1}>
                    {diagnosis.title}
                  </Typography>
                  <Typography variant="body2" color="secondary" numberOfLines={2} style={styles.diagnosisDescription}>
                    {diagnosis.description}
                  </Typography>
                  <View style={styles.statusContainer}>
                    <View 
                      style={[
                        styles.statusDot, 
                        { 
                          backgroundColor: diagnosis.status === 'completed' 
                            ? colors.success[500] 
                            : diagnosis.status === 'pending' 
                              ? colors.warning[500] 
                              : colors.primary[500]
                        }
                      ]} 
                    />
                    <Typography variant="caption" color="secondary" style={styles.statusText}>
                      {diagnosis.status.charAt(0).toUpperCase() + diagnosis.status.slice(1)}
                    </Typography>
                  </View>
                </View>
              </Card>
            ))}

            <Card style={styles.newDiagnosisCard} onPress={handleNewDiagnosis}>
              <View style={styles.newDiagnosisContent}>
                <Plus size={32} color={colors.primary[500]} />
                <Typography variant="body1" weight="medium" style={{ color: colors.primary[500], textAlign: 'center', marginTop: 12 }}>
                  {t('startNewDiagnosis')}
                </Typography>
              </View>
            </Card>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Typography variant="h5" weight="bold" style={styles.sectionTitle}>
            {t('serviceCategories')}
          </Typography>
          <View style={styles.categoriesGrid}>
            {serviceCategories.map((category) => (
              <View key={category.id} style={[styles.categoryItem, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <View style={[styles.categoryIconContainer, { backgroundColor: colors.primary[50] }]}>
                  <Wrench size={24} color={colors.primary[500]} />
                </View>
                <Typography variant="body2" weight="medium" style={styles.categoryName}>
                  {category.name}
                </Typography>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Typography variant="h5" weight="bold">{t('maintenanceTips')}</Typography>
            <Button
              title={t('viewAll')}
              variant="ghost"
              size="sm"
              rightIcon={<ArrowRight size={16} color={colors.primary[500]} />}
            />
          </View>

          {maintenanceTips.map((tip) => (
            <Card key={tip.id} style={styles.tipCard}>
              <Image source={{ uri: tip.imageUrl }} style={styles.tipImage} />
              <View style={styles.tipContent}>
                <Typography variant="h6" weight="medium">{tip.title}</Typography>
                <Typography variant="body2" color="secondary">{tip.description}</Typography>
              </View>
            </Card>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Typography variant="h5" weight="bold">{t('findProfessionals')}</Typography>
            <Button
              title={t('viewAll')}
              variant="ghost"
              size="sm"
              onPress={handleViewAllProfessionals}
              rightIcon={<ArrowRight size={16} color={colors.primary[500]} />}
            />
          </View>

          <Card style={styles.findProsCard}>
            <View style={styles.findProsContent}>
              <View style={styles.findProsInfo}>
                <Typography variant="h5" weight="bold">{t('needRepairExpert')}</Typography>
                <Typography variant="body2" color="secondary" style={styles.findProsDescription}>
                  {t('browseNetwork')}
                </Typography>
                <Button
                  title={t('findPros')}
                  onPress={handleViewAllProfessionals}
                  style={styles.findProsButton}
                />
              </View>
              <View style={styles.findProsImageContainer}>
                <Calendar size={64} color={colors.primary[500]} />
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.md,
    paddingBottom: Layout.spacing.sm,
  },
  headerContent: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: Layout.borderRadius.circular,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Layout.spacing.xxl,
  },
  heroSection: {
    paddingHorizontal: Layout.spacing.lg,
    marginTop: Layout.spacing.md,
  },
  heroCard: {
    backgroundColor: Colors.light.primary[600],
    padding: Layout.spacing.lg,
  },
  heroTitle: {
    color: 'white',
    marginBottom: Layout.spacing.xs,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: Layout.spacing.lg,
  },
  heroButton: {
    backgroundColor: 'white',
  },
  section: {
    marginTop: Layout.spacing.xl,
    paddingHorizontal: Layout.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  sectionTitle: {
    marginBottom: Layout.spacing.md,
  },
  recentDiagnosesContent: {
    paddingRight: Layout.spacing.lg,
  },
  diagnosisCard: {
    width: 240,
    padding: 0,
    overflow: 'hidden',
    marginRight: Layout.spacing.md,
  },
  diagnosisImage: {
    width: '100%',
    height: 120,
  },
  diagnosisInfo: {
    padding: Layout.spacing.md,
  },
  diagnosisDescription: {
    marginTop: Layout.spacing.xs,
    marginBottom: Layout.spacing.sm,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Layout.spacing.xs,
  },
  statusText: {
    textTransform: 'capitalize',
  },
  newDiagnosisCard: {
    width: 150,
    height: 200,
    marginRight: Layout.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.primary[50],
  },
  newDiagnosisContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Layout.spacing.md,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Layout.spacing.md,
  },
  categoryItem: {
    width: '31%',
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  categoryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: Layout.borderRadius.circular,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  categoryName: {
    textAlign: 'center',
  },
  tipCard: {
    flexDirection: 'row',
    padding: 0,
    overflow: 'hidden',
    marginBottom: Layout.spacing.md,
  },
  tipImage: {
    width: 100,
    height: 100,
  },
  tipContent: {
    flex: 1,
    padding: Layout.spacing.md,
  },
  findProsCard: {
    overflow: 'hidden',
    marginBottom: Layout.spacing.md,
  },
  findProsContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  findProsInfo: {
    flex: 2,
    padding: Layout.spacing.md,
  },
  findProsDescription: {
    marginTop: Layout.spacing.xs,
    marginBottom: Layout.spacing.md,
  },
  findProsButton: {
    alignSelf: 'flex-start',
  },
  findProsImageContainer: {
    flex: 1,
    padding: Layout.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});