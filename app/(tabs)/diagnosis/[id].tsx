import React from 'react';
import { View, StyleSheet, ScrollView, Image, useColorScheme } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { diagnoses } from '@/utils/mockData';
import { Typography } from '@/components/common/Typography';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { router } from 'expo-router';
import { TriangleAlert as AlertTriangle, PenTool as Tools, ShoppingBag, Share2, ArrowLeft } from 'lucide-react-native';
import { useTranslation } from '@/utils/i18n';

export default function DiagnosisDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { t } = useTranslation();
  
  const diagnosis = diagnoses.find(d => d.id === id);
  
  if (!diagnosis) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <AlertTriangle size={48} color={colors.error[500]} />
          <Typography variant="h5" weight="bold" style={styles.errorTitle}>
            {t('diagnosisNotFound')}
          </Typography>
          <Typography variant="body1" color="secondary" style={styles.errorMessage}>
            {t('diagnosisNotFoundMessage')}
          </Typography>
          <Button
            title={t('goBack')}
            onPress={() => router.back()}
            leftIcon={<ArrowLeft size={16} color="white" />}
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: diagnosis.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Typography variant="h4" weight="bold" style={styles.title}>
              {diagnosis.title}
            </Typography>
            
            <View 
              style={[
                styles.statusBadge,
                { 
                  backgroundColor: diagnosis.status === 'completed' 
                    ? colors.success[100] 
                    : diagnosis.status === 'pending' 
                      ? colors.warning[100] 
                      : colors.primary[100]
                }
              ]}
            >
              <Typography 
                variant="body2" 
                weight="medium"
                style={{ 
                  color: diagnosis.status === 'completed' 
                    ? colors.success[700] 
                    : diagnosis.status === 'pending' 
                      ? colors.warning[700] 
                      : colors.primary[700],
                }}
              >
                {t(diagnosis.status)}
              </Typography>
            </View>
          </View>
          
          <Typography variant="body1" color="secondary" style={styles.description}>
            {diagnosis.description}
          </Typography>
          
          <Typography variant="caption" color="tertiary" style={styles.date}>
            {t('createdOn')} {new Date(diagnosis.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Typography>
          
          {diagnosis.status === 'pending' ? (
            <Card style={styles.pendingCard}>
              <View style={styles.pendingContent}>
                <Typography variant="h6" weight="bold">
                  {t('analysisInProgress')}
                </Typography>
                <Typography variant="body2" color="secondary" style={styles.pendingText}>
                  {t('analysisProgressMessage')}
                </Typography>
                <Button
                  title={t('checkAnalysisStatus')}
                  onPress={() => {/* Check status */}}
                  variant="outline"
                  style={styles.pendingButton}
                />
              </View>
            </Card>
          ) : diagnosis.result ? (
            <View style={styles.resultSection}>
              <Typography variant="h5" weight="bold" style={styles.sectionTitle}>
                {t('diagnosisResults')}
              </Typography>
              
              <Card style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Typography variant="h6" weight="bold">
                    {t('identifiedIssue')}
                  </Typography>
                  <View 
                    style={[
                      styles.severityBadge,
                      { 
                        backgroundColor: 
                          diagnosis.result.severity === 'high' 
                            ? colors.error[100]
                            : diagnosis.result.severity === 'medium'
                              ? colors.warning[100]
                              : colors.success[100]
                      }
                    ]}
                  >
                    <Typography 
                      variant="caption" 
                      weight="medium"
                      style={{ 
                        color: 
                          diagnosis.result.severity === 'high' 
                            ? colors.error[700]
                            : diagnosis.result.severity === 'medium'
                              ? colors.warning[700]
                              : colors.success[700]
                      }}
                    >
                      {diagnosis.result.severity === 'high' 
                        ? t('highSeverity')
                        : diagnosis.result.severity === 'medium'
                          ? t('mediumSeverity')
                          : t('lowSeverity')} {t('severity')}
                    </Typography>
                  </View>
                </View>
                
                <Typography variant="body1" weight="medium" style={styles.issueText}>
                  {diagnosis.result.issue}
                </Typography>
              </Card>
              
              <Typography variant="h6" weight="bold" style={styles.subSectionTitle}>
                {t('recommendedActions')}
              </Typography>
              
              <Card style={styles.actionsCard}>
                <View style={styles.cardHeader}>
                  <Tools size={20} color={colors.primary[500]} />
                  <Typography variant="body1" weight="medium" style={styles.cardHeaderText}>
                    {t('stepsToFix')}
                  </Typography>
                </View>
                
                {diagnosis.result.recommendedActions.map((action, index) => (
                  <View key={index} style={styles.actionItem}>
                    <View style={[styles.actionNumber, { backgroundColor: colors.primary[500] }]}>
                      <Typography variant="caption" style={styles.actionNumberText}>
                        {index + 1}
                      </Typography>
                    </View>
                    <Typography variant="body2" style={styles.actionText}>
                      {action}
                    </Typography>
                  </View>
                ))}
              </Card>
              
              <Typography variant="h6" weight="bold" style={styles.subSectionTitle}>
                {t('requiredParts')}
              </Typography>
              
              <Card style={styles.partsCard}>
                <View style={styles.cardHeader}>
                  <ShoppingBag size={20} color={colors.primary[500]} />
                  <Typography variant="body1" weight="medium" style={styles.cardHeaderText}>
                    {t('partsList')}
                  </Typography>
                </View>
                
                {diagnosis.result.requiredParts.map((part) => (
                  <View key={part.id} style={styles.partItem}>
                    <View>
                      <Typography variant="body2" weight="medium">
                        {part.name}
                      </Typography>
                      <Typography variant="caption" color="secondary">
                        {t('estimatedCost')} {part.estimatedCost}
                      </Typography>
                    </View>
                    
                    <View 
                      style={[
                        styles.availabilityBadge,
                        { 
                          backgroundColor: 
                            part.availabilityStatus === 'in-stock' 
                              ? colors.success[100]
                              : part.availabilityStatus === 'limited'
                                ? colors.warning[100]
                                : colors.error[100]
                        }
                      ]}
                    >
                      <Typography 
                        variant="caption"
                        style={{ 
                          color: 
                            part.availabilityStatus === 'in-stock' 
                              ? colors.success[700]
                              : part.availabilityStatus === 'limited'
                                ? colors.warning[700]
                                : colors.error[700]
                        }}
                      >
                        {part.availabilityStatus === 'in-stock' 
                          ? t('inStock')
                          : part.availabilityStatus === 'limited'
                            ? t('limited')
                            : t('outOfStock')}
                      </Typography>
                    </View>
                  </View>
                ))}
              </Card>
            </View>
          ) : null}
          
          <View style={styles.actionButtons}>
            <Button
              title={t('findProfessionalsButton')}
              onPress={() => router.navigate('/(tabs)/professionals')}
              style={styles.mainButton}
            />
            
            <Button
              title={t('share')}
              variant="outline"
              onPress={() => {/* Share functionality */}}
              leftIcon={<Share2 size={16} color={colors.primary[500]} />}
              style={styles.secondaryButton}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.xl,
  },
  errorTitle: {
    marginTop: Layout.spacing.lg,
    marginBottom: Layout.spacing.sm,
  },
  errorMessage: {
    textAlign: 'center',
    marginBottom: Layout.spacing.xl,
  },
  errorButton: {
    minWidth: 150,
  },
  imageContainer: {
    width: '100%',
    height: 250,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: Layout.spacing.lg,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  title: {
    flex: 1,
    marginRight: Layout.spacing.md,
  },
  statusBadge: {
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.circular,
  },
  description: {
    marginBottom: Layout.spacing.md,
  },
  date: {
    marginBottom: Layout.spacing.lg,
  },
  pendingCard: {
    marginVertical: Layout.spacing.lg,
    backgroundColor: '#F8FAFC',
  },
  pendingContent: {
    alignItems: 'center',
    padding: Layout.spacing.md,
  },
  pendingText: {
    textAlign: 'center',
    marginVertical: Layout.spacing.md,
  },
  pendingButton: {
    marginTop: Layout.spacing.sm,
  },
  resultSection: {
    marginTop: Layout.spacing.lg,
  },
  sectionTitle: {
    marginBottom: Layout.spacing.md,
  },
  resultCard: {
    marginBottom: Layout.spacing.lg,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  severityBadge: {
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: 2,
    borderRadius: Layout.borderRadius.circular,
  },
  issueText: {
    marginTop: Layout.spacing.xs,
  },
  subSectionTitle: {
    marginBottom: Layout.spacing.sm,
  },
  actionsCard: {
    marginBottom: Layout.spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  cardHeaderText: {
    marginLeft: Layout.spacing.sm,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Layout.spacing.md,
  },
  actionNumber: {
    width: 24,
    height: 24,
    borderRadius: Layout.borderRadius.circular,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.sm,
    marginTop: 2,
  },
  actionNumberText: {
    color: 'white',
    fontFamily: 'Inter-Bold',
  },
  actionText: {
    flex: 1,
  },
  partsCard: {
    marginBottom: Layout.spacing.lg,
  },
  partItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  availabilityBadge: {
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: 4,
    borderRadius: Layout.borderRadius.circular,
  },
  actionButtons: {
    marginTop: Layout.spacing.lg,
  },
  mainButton: {
    marginBottom: Layout.spacing.md,
  },
  secondaryButton: {
    marginBottom: Layout.spacing.md,
  },
});