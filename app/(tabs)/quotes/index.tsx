import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  useColorScheme, 
  TouchableOpacity,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Typography } from '@/components/common/Typography';
import { Card } from '@/components/common/Card';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { quotes } from '@/utils/mockData';
import { CreditCard, CircleAlert as AlertCircle, ChevronRight, Clock, CircleCheck as CheckCircle2, Circle as XCircle, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { useTranslation } from '@/utils/i18n';

type QuoteStatus = 'all' | 'pending' | 'accepted' | 'rejected' | 'expired';

export default function QuotesScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { t } = useTranslation();
  
  const [activeTab, setActiveTab] = useState<QuoteStatus>('all');
  
  const tabs: { id: QuoteStatus; label: string }[] = [
    { id: 'all', label: t('all') },
    { id: 'pending', label: t('pending') },
    { id: 'accepted', label: t('accepted') },
    { id: 'rejected', label: t('rejected') },
  ];
  
  const filteredQuotes = quotes.filter(quote => {
    if (activeTab === 'all') return true;
    return quote.status === activeTab;
  });
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={18} color={colors.warning[500]} />;
      case 'accepted':
        return <CheckCircle2 size={18} color={colors.success[500]} />;
      case 'rejected':
        return <XCircle size={18} color={colors.error[500]} />;
      case 'expired':
        return <AlertTriangle size={18} color={colors.textTertiary} />;
      default:
        return <Clock size={18} color={colors.warning[500]} />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return colors.warning[500];
      case 'accepted':
        return colors.success[500];
      case 'rejected':
        return colors.error[500];
      case 'expired':
        return colors.textTertiary;
      default:
        return colors.warning[500];
    }
  };
  
  const getFairnessColor = (fairness: string) => {
    switch (fairness) {
      case 'below_market':
        return colors.success[500];
      case 'market_rate':
        return colors.primary[500];
      case 'above_market':
        return colors.warning[500];
      default:
        return colors.primary[500];
    }
  };
  
  const getFairnessText = (fairness: string) => {
    switch (fairness) {
      case 'below_market':
        return t('belowMarket');
      case 'market_rate':
        return t('marketRate');
      case 'above_market':
        return t('aboveMarket');
      default:
        return t('notAnalyzed');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Typography variant="h4" weight="bold" style={styles.title}>{t('quoteManagement')}</Typography>
        <Typography variant="body2" color="secondary" style={styles.subtitle}>
          {t('reviewAndManageQuotes')}
        </Typography>
      </View>
      
      <View style={styles.tabsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabs}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && { 
                  backgroundColor: colors.primary[500],
                }
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Typography
                variant="body2"
                weight="medium"
                style={{
                  color: activeTab === tab.id ? 'white' : colors.text,
                }}
              >
                {tab.label}
              </Typography>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredQuotes.length > 0 ? (
          filteredQuotes.map((quote) => (
            <Card 
              key={quote.id}
              style={styles.quoteCard}
              onPress={() => router.navigate(`/(tabs)/quotes/${quote.id}`)}
              animated
            >
              <View style={styles.quoteHeader}>
                <View style={styles.proInfo}>
                  <Image 
                    source={{ uri: quote.professional.profileImageUrl }} 
                    style={styles.proImage} 
                  />
                  <View>
                    <Typography variant="h6" weight="medium">
                      {quote.professional.name}
                    </Typography>
                    <View style={styles.diagnosisContainer}>
                      <Typography variant="caption" color="secondary">
                        {t('for')}: 
                      </Typography>
                      <Typography 
                        variant="caption" 
                        weight="medium" 
                        style={styles.diagnosisTitle}
                      >
                        {quote.diagnosisTitle}
                      </Typography>
                    </View>
                  </View>
                </View>
                
                <View style={styles.statusContainer}>
                  {getStatusIcon(quote.status)}
                  <Typography 
                    variant="caption" 
                    weight="medium"
                    style={[styles.statusText, { color: getStatusColor(quote.status) }]}
                  >
                    {t(quote.status)}
                  </Typography>
                </View>
              </View>
              
              <View style={styles.quoteMid}>
                <View>
                  <Typography variant="h5" weight="bold" style={styles.amount}>
                    {quote.amount}
                  </Typography>
                  <Typography variant="caption" color="secondary">
                    {t('est')} {quote.estimatedDuration}
                  </Typography>
                </View>
                
                {quote.aiAnalysis && (
                  <View 
                    style={[
                      styles.fairnessBadge,
                      { backgroundColor: colors.primary[50] }
                    ]}
                  >
                    <AlertCircle size={14} color={getFairnessColor(quote.aiAnalysis.fairnessRating)} />
                    <Typography 
                      variant="caption"
                      style={[
                        styles.fairnessText,
                        { color: getFairnessColor(quote.aiAnalysis.fairnessRating) }
                      ]}
                    >
                      {getFairnessText(quote.aiAnalysis.fairnessRating)}
                    </Typography>
                  </View>
                )}
              </View>
              
              <View style={styles.quoteContent}>
                <Typography variant="body2" color="secondary" numberOfLines={2}>
                  {quote.serviceDetails.slice(0, 2).join(', ')}
                  {quote.serviceDetails.length > 2 ? '...' : ''}
                </Typography>
              </View>
              
              <View style={styles.quoteFooter}>
                <Typography variant="caption" color="tertiary">
                  {t('expires')}: {new Date(quote.expiresAt).toLocaleDateString()}
                </Typography>
                <ChevronRight size={16} color={colors.textTertiary} />
              </View>
            </Card>
          ))
        ) : (
          <View style={styles.emptyState}>
            <CreditCard size={48} color={colors.textTertiary} />
            <Typography variant="h6" weight="bold" style={styles.emptyTitle}>
              {t('noQuotesFound')}
            </Typography>
            <Typography variant="body2" color="secondary" style={styles.emptyText}>
              {activeTab === 'all' 
                ? t('noQuotesYet')
                : t('noFilteredQuotes')}
            </Typography>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Layout.spacing.lg,
    paddingBottom: Layout.spacing.sm,
  },
  title: {
    marginBottom: Layout.spacing.xs,
  },
  subtitle: {
    maxWidth: '90%',
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabs: {
    paddingHorizontal: Layout.spacing.lg,
  },
  tab: {
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    marginRight: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.circular,
    marginBottom: Layout.spacing.sm,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xxl,
  },
  quoteCard: {
    marginBottom: Layout.spacing.md,
  },
  quoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Layout.spacing.md,
  },
  proInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  proImage: {
    width: 40,
    height: 40,
    borderRadius: Layout.borderRadius.circular,
    marginRight: Layout.spacing.sm,
  },
  diagnosisContainer: {
    flexDirection: 'row',
  },
  diagnosisTitle: {
    marginLeft: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 4,
  },
  quoteMid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  amount: {
    marginBottom: 2,
  },
  fairnessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: 4,
    borderRadius: Layout.borderRadius.circular,
  },
  fairnessText: {
    marginLeft: 4,
  },
  quoteContent: {
    marginBottom: Layout.spacing.md,
  },
  quoteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Layout.spacing.xxl,
  },
  emptyTitle: {
    marginTop: Layout.spacing.lg,
    marginBottom: Layout.spacing.sm,
  },
  emptyText: {
    textAlign: 'center',
    maxWidth: '80%',
  },
});