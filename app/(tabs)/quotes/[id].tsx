import React from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Image, 
  useColorScheme, 
  TouchableOpacity 
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { quotes } from '@/utils/mockData';
import { Typography } from '@/components/common/Typography';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { router } from 'expo-router';
import { TriangleAlert as AlertTriangle, Clock, CircleCheck as CheckCircle2, Circle as XCircle, CircleAlert as AlertCircle, Star, CircleHelp as HelpCircle, ChevronRight, MessageSquare, Phone, Calendar, ArrowLeft } from 'lucide-react-native';

export default function QuoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const quote = quotes.find(q => q.id === id);
  
  if (!quote) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <AlertTriangle size={48} color={colors.error[500]} />
          <Typography variant="h5" weight="bold" style={styles.errorTitle}>
            Quote Not Found
          </Typography>
          <Typography variant="body1" color="secondary" style={styles.errorMessage}>
            The quote you're looking for doesn't exist or has been removed.
          </Typography>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            leftIcon={<ArrowLeft size={16} color="white" />}
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={24} color={colors.warning[500]} />;
      case 'accepted':
        return <CheckCircle2 size={24} color={colors.success[500]} />;
      case 'rejected':
        return <XCircle size={24} color={colors.error[500]} />;
      case 'expired':
        return <AlertTriangle size={24} color={colors.textTertiary} />;
      default:
        return <Clock size={24} color={colors.warning[500]} />;
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
  
  const getStatusBackground = (status: string) => {
    switch (status) {
      case 'pending':
        return colors.warning[50];
      case 'accepted':
        return colors.success[50];
      case 'rejected':
        return colors.error[50];
      case 'expired':
        return '#F5F5F5';
      default:
        return colors.warning[50];
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
        return 'Below Market Rate';
      case 'market_rate':
        return 'Market Rate';
      case 'above_market':
        return 'Above Market Rate';
      default:
        return 'Not Analyzed';
    }
  };
  
  const handleAccept = () => {
    // Handle accept logic
  };
  
  const handleReject = () => {
    // Handle reject logic
  };
  
  const handleModify = () => {
    // Handle modify logic
  };
  
  const handleMessage = () => {
    // Handle message logic
  };
  
  const handleCall = () => {
    // Handle call logic
  };
  
  const handleSchedule = () => {
    // Handle schedule logic
  };
  
  const handleViewProfessional = () => {
    router.navigate(`/(tabs)/professionals/${quote.professionalId}`);
  };
  
  const handleViewDiagnosis = () => {
    router.navigate(`/(tabs)/diagnosis/${quote.diagnosisId}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.statusHeader}>
          <View 
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusBackground(quote.status) }
            ]}
          >
            {getStatusIcon(quote.status)}
            <Typography 
              variant="body1" 
              weight="bold"
              style={[styles.statusText, { color: getStatusColor(quote.status) }]}
            >
              {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
            </Typography>
          </View>
        </View>
        
        <View style={styles.amountContainer}>
          <Typography variant="h3" weight="bold" style={styles.amount}>
            {quote.amount}
          </Typography>
          <Typography variant="body2" color="secondary" style={styles.amountSubtitle}>
            Estimated duration: {quote.estimatedDuration}
          </Typography>
          
          {quote.aiAnalysis && (
            <View style={[styles.fairnessContainer, { backgroundColor: colors.primary[50] }]}>
              <AlertCircle size={16} color={getFairnessColor(quote.aiAnalysis.fairnessRating)} />
              <Typography 
                variant="body2"
                weight="medium"
                style={[styles.fairnessText, { color: getFairnessColor(quote.aiAnalysis.fairnessRating) }]}
              >
                {getFairnessText(quote.aiAnalysis.fairnessRating)}
              </Typography>
              <Typography 
                variant="caption"
                style={styles.confidenceText}
              >
                ({(quote.aiAnalysis.confidenceScore * 100).toFixed(0)}% confidence)
              </Typography>
            </View>
          )}
        </View>
        
        <Card style={styles.professionalCard}>
          <TouchableOpacity 
            style={styles.professionalContainer}
            onPress={handleViewProfessional}
          >
            <Image 
              source={{ uri: quote.professional.profileImageUrl }} 
              style={styles.proImage} 
            />
            <View style={styles.proInfo}>
              <Typography variant="h6" weight="bold">
                {quote.professional.name}
              </Typography>
              <View style={styles.ratingContainer}>
                <Star size={16} color="#FFB800" fill="#FFB800" />
                <Typography variant="body2" weight="medium" style={styles.ratingText}>
                  {quote.professional.rating.toFixed(1)}
                </Typography>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </Card>
        
        <Card style={styles.detailsCard}>
          <Typography variant="h6" weight="bold" style={styles.sectionTitle}>
            Quote Details
          </Typography>
          
          <View style={styles.detailItem}>
            <Typography variant="body2" color="secondary">
              For diagnosis:
            </Typography>
            <TouchableOpacity 
              style={styles.diagnosisLink}
              onPress={handleViewDiagnosis}
            >
              <Typography variant="body2" style={{ color: colors.primary[500] }}>
                {quote.diagnosisTitle}
              </Typography>
              <ChevronRight size={16} color={colors.primary[500]} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.detailItem}>
            <Typography variant="body2" color="secondary">
              Created on:
            </Typography>
            <Typography variant="body2">
              {new Date(quote.createdAt).toLocaleDateString()}
            </Typography>
          </View>
          
          <View style={styles.detailItem}>
            <Typography variant="body2" color="secondary">
              Expires on:
            </Typography>
            <Typography variant="body2">
              {new Date(quote.expiresAt).toLocaleDateString()}
            </Typography>
          </View>
        </Card>
        
        <Card style={styles.servicesCard}>
          <Typography variant="h6" weight="bold" style={styles.sectionTitle}>
            Services Included
          </Typography>
          
          {quote.serviceDetails.map((service, index) => (
            <View key={index} style={styles.serviceItem}>
              <View style={[styles.serviceBullet, { backgroundColor: colors.primary[500] }]} />
              <Typography variant="body2">
                {service}
              </Typography>
            </View>
          ))}
        </Card>
        
        {quote.aiAnalysis && (
          <Card style={styles.analysisCard}>
            <View style={styles.analysisHeader}>
              <Typography variant="h6" weight="bold">
                AI Analysis
              </Typography>
              <TouchableOpacity style={styles.helpButton}>
                <HelpCircle size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            {quote.aiAnalysis.notes.map((note, index) => (
              <View key={index} style={styles.analysisItem}>
                <View 
                  style={[
                    styles.analysisIcon,
                    { 
                      backgroundColor: 
                        note.includes('within') || note.includes('accurate') || note.includes('reasonable')
                          ? colors.success[100]
                          : note.includes('above') || note.includes('consider')
                            ? colors.warning[100]
                            : colors.primary[100]
                    }
                  ]}
                >
                  {note.includes('within') || note.includes('accurate') || note.includes('reasonable') ? (
                    <CheckCircle2 
                      size={14} 
                      color={colors.success[500]} 
                    />
                  ) : note.includes('above') || note.includes('consider') ? (
                    <AlertCircle 
                      size={14} 
                      color={colors.warning[500]} 
                    />
                  ) : (
                    <AlertCircle 
                      size={14} 
                      color={colors.primary[500]} 
                    />
                  )}
                </View>
                <Typography variant="body2" style={styles.analysisText}>
                  {note}
                </Typography>
              </View>
            ))}
          </Card>
        )}
        
        {quote.status === 'pending' && (
          <View style={styles.actionButtons}>
            <Button
              title="Accept Quote"
              onPress={handleAccept}
              leftIcon={<CheckCircle2 size={16} color="white" />}
              style={styles.acceptButton}
            />
            
            <View style={styles.secondaryActions}>
              <Button
                title="Request Modification"
                variant="outline"
                size="sm"
                onPress={handleModify}
                style={styles.modifyButton}
              />
              
              <Button
                title="Reject"
                variant="outline"
                size="sm"
                onPress={handleReject}
                leftIcon={<XCircle size={16} color={colors.error[500]} />}
                style={[styles.rejectButton, { borderColor: colors.error[500] }]}
              />
            </View>
          </View>
        )}
        
        {quote.status === 'accepted' && (
          <View style={styles.acceptedActions}>
            <Card style={[styles.nextStepsCard, { backgroundColor: colors.success[50] }]}>
              <Typography variant="h6" weight="bold" style={styles.nextStepsTitle}>
                Next Steps
              </Typography>
              <Typography variant="body2" style={styles.nextStepsText}>
                You've accepted this quote. Contact the professional to schedule the service.
              </Typography>
            </Card>
            
            <View style={styles.contactButtons}>
              <Button
                title="Schedule"
                onPress={handleSchedule}
                leftIcon={<Calendar size={16} color="white" />}
                style={styles.scheduleButton}
              />
              
              <View style={styles.contactActions}>
                <TouchableOpacity 
                  style={[styles.contactButton, { backgroundColor: colors.primary[50] }]}
                  onPress={handleMessage}
                >
                  <MessageSquare size={24} color={colors.primary[500]} />
                  <Typography variant="caption" style={{ color: colors.primary[700] }}>
                    Message
                  </Typography>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.contactButton, { backgroundColor: colors.success[50] }]}
                  onPress={handleCall}
                >
                  <Phone size={24} color={colors.success[500]} />
                  <Typography variant="caption" style={{ color: colors.success[700] }}>
                    Call
                  </Typography>
                </TouchableOpacity>
              </View>
            </View>
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
  statusHeader: {
    alignItems: 'center',
    padding: Layout.spacing.lg,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.circular,
  },
  statusText: {
    marginLeft: Layout.spacing.sm,
  },
  amountContainer: {
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
  },
  amount: {
    marginBottom: Layout.spacing.xs,
  },
  amountSubtitle: {
    marginBottom: Layout.spacing.sm,
  },
  fairnessContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.circular,
  },
  fairnessText: {
    marginLeft: Layout.spacing.xs,
  },
  confidenceText: {
    marginLeft: Layout.spacing.xs,
  },
  professionalCard: {
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  professionalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  proImage: {
    width: 50,
    height: 50,
    borderRadius: Layout.borderRadius.circular,
  },
  proInfo: {
    flex: 1,
    marginLeft: Layout.spacing.md,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingText: {
    marginLeft: Layout.spacing.xs,
  },
  detailsCard: {
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  sectionTitle: {
    marginBottom: Layout.spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.sm,
  },
  diagnosisLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  servicesCard: {
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Layout.spacing.sm,
  },
  serviceBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: Layout.spacing.sm,
  },
  analysisCard: {
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
  },
  analysisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.md,
  },
  helpButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  analysisItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Layout.spacing.sm,
  },
  analysisIcon: {
    width: 24,
    height: 24,
    borderRadius: Layout.borderRadius.circular,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.sm,
  },
  analysisText: {
    flex: 1,
  },
  actionButtons: {
    padding: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xxl,
  },
  acceptButton: {
    marginBottom: Layout.spacing.md,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modifyButton: {
    flex: 1,
    marginRight: Layout.spacing.md,
  },
  rejectButton: {
    flex: 1,
  },
  acceptedActions: {
    padding: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xxl,
  },
  nextStepsCard: {
    marginBottom: Layout.spacing.lg,
  },
  nextStepsTitle: {
    marginBottom: Layout.spacing.sm,
  },
  nextStepsText: {
    lineHeight: 22,
  },
  contactButtons: {
    marginBottom: Layout.spacing.xl,
  },
  scheduleButton: {
    marginBottom: Layout.spacing.md,
  },
  contactActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  contactButton: {
    width: 80,
    height: 80,
    borderRadius: Layout.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
});