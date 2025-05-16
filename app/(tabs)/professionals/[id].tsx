import React from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Image, 
  useColorScheme,
  Linking,
  TouchableOpacity
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { professionals } from '@/utils/mockData';
import { Typography } from '@/components/common/Typography';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { router } from 'expo-router';
import { TriangleAlert as AlertTriangle, Star, MapPin, Phone, Mail, Globe, Calendar, Clock, Share2, ArrowLeft, MessageCircle } from 'lucide-react-native';

export default function ProfessionalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const professional = professionals.find(p => p.id === id);
  
  if (!professional) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <AlertTriangle size={48} color={colors.error[500]} />
          <Typography variant="h5" weight="bold" style={styles.errorTitle}>
            Professional Not Found
          </Typography>
          <Typography variant="body1" color="secondary" style={styles.errorMessage}>
            The professional you're looking for doesn't exist or has been removed.
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

  const handleCall = () => {
    Linking.openURL(`tel:${professional.contactInfo.phone}`);
  };
  
  const handleEmail = () => {
    Linking.openURL(`mailto:${professional.contactInfo.email}`);
  };
  
  const handleWebsite = () => {
    if (professional.contactInfo.website) {
      Linking.openURL(professional.contactInfo.website);
    }
  };
  
  const handleSchedule = () => {
    // Handle scheduling
  };
  
  const handleMessage = () => {
    // Handle messaging
  };
  
  const handleShare = () => {
    // Handle sharing
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={{ uri: professional.profileImageUrl }}
            style={styles.profileImage}
          />
          
          <View style={styles.headerInfo}>
            <Typography variant="h4" weight="bold" style={styles.name}>
              {professional.name}
            </Typography>
            
            <View style={styles.ratingContainer}>
              <Star size={18} color="#FFB800" fill="#FFB800" />
              <Typography variant="body1" weight="medium" style={styles.ratingText}>
                {professional.rating.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="secondary">
                ({professional.reviews} reviews)
              </Typography>
            </View>
            
            <View style={styles.locationContainer}>
              <MapPin size={16} color={colors.textSecondary} />
              <Typography variant="body2" color="secondary" style={styles.locationText}>
                {professional.location} • {professional.distance}
              </Typography>
            </View>
          </View>
        </View>
        
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary[50] }]}
            onPress={handleCall}
          >
            <Phone size={24} color={colors.primary[500]} />
            <Typography variant="caption" style={{ color: colors.primary[700] }}>
              Call
            </Typography>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.secondary[50] }]}
            onPress={handleEmail}
          >
            <Mail size={24} color={colors.secondary[500]} />
            <Typography variant="caption" style={{ color: colors.secondary[700] }}>
              Email
            </Typography>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.accent[50] }]}
            onPress={handleMessage}
          >
            <MessageCircle size={24} color={colors.accent[500]} />
            <Typography variant="caption" style={{ color: colors.accent[700] }}>
              Message
            </Typography>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.success[50] }]}
            onPress={handleShare}
          >
            <Share2 size={24} color={colors.success[500]} />
            <Typography variant="caption" style={{ color: colors.success[700] }}>
              Share
            </Typography>
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          <Card style={styles.specialtiesCard}>
            <Typography variant="h6" weight="bold" style={styles.cardTitle}>
              Specialties
            </Typography>
            
            <View style={styles.specialtiesContainer}>
              {professional.specialties.map((specialty, index) => (
                <View 
                  key={index}
                  style={[styles.specialtyChip, { backgroundColor: colors.primary[50] }]}
                >
                  <Typography 
                    variant="body2" 
                    style={{ color: colors.primary[700] }}
                  >
                    {specialty}
                  </Typography>
                </View>
              ))}
            </View>
          </Card>
          
          <Card style={styles.aboutCard}>
            <Typography variant="h6" weight="bold" style={styles.cardTitle}>
              About
            </Typography>
            
            <Typography variant="body2" color="secondary" style={styles.bioText}>
              {professional.bio}
            </Typography>
          </Card>
          
          <Card style={styles.contactCard}>
            <Typography variant="h6" weight="bold" style={styles.cardTitle}>
              Contact Information
            </Typography>
            
            <View style={styles.contactItem}>
              <Phone size={18} color={colors.primary[500]} />
              <Typography variant="body2" style={styles.contactText}>
                {professional.contactInfo.phone}
              </Typography>
            </View>
            
            <View style={styles.contactItem}>
              <Mail size={18} color={colors.primary[500]} />
              <Typography variant="body2" style={styles.contactText}>
                {professional.contactInfo.email}
              </Typography>
            </View>
            
            {professional.contactInfo.website && (
              <View style={styles.contactItem}>
                <Globe size={18} color={colors.primary[500]} />
                <Typography 
                  variant="body2" 
                  style={[styles.contactText, { color: colors.primary[500] }]}
                  onPress={handleWebsite}
                >
                  {professional.contactInfo.website}
                </Typography>
              </View>
            )}
          </Card>
          
          <Card style={styles.availabilityCard}>
            <Typography variant="h6" weight="bold" style={styles.cardTitle}>
              Availability
            </Typography>
            
            <View style={styles.availabilityHeader}>
              <View style={styles.availabilityStatus}>
                <View 
                  style={[
                    styles.statusDot,
                    { 
                      backgroundColor: 
                        professional.availability.status === 'available' 
                          ? colors.success[500]
                          : professional.availability.status === 'limited'
                            ? colors.warning[500]
                            : colors.error[500]
                    }
                  ]}
                />
                <Typography 
                  variant="body2" 
                  weight="medium"
                  style={{ 
                    color: 
                      professional.availability.status === 'available' 
                        ? colors.success[700]
                        : professional.availability.status === 'limited'
                          ? colors.warning[700]
                          : colors.error[700]
                  }}
                >
                  {professional.availability.status === 'available' 
                    ? 'Available Now'
                    : professional.availability.status === 'limited'
                      ? 'Limited Availability'
                      : 'Currently Unavailable'}
                </Typography>
              </View>
              
              <Typography variant="body2" color="secondary" style={styles.rateText}>
                Rate: {professional.hourlyRate}/hr
              </Typography>
            </View>
            
            {professional.availability.nextAvailable && (
              <View style={styles.nextAvailableContainer}>
                <Clock size={16} color={colors.textSecondary} />
                <Typography variant="body2" color="secondary" style={styles.nextAvailableText}>
                  Next Available: {professional.availability.nextAvailable}
                </Typography>
              </View>
            )}
            
            <Button
              title="Schedule Appointment"
              onPress={handleSchedule}
              leftIcon={<Calendar size={16} color="white" />}
              style={styles.scheduleButton}
            />
          </Card>
          
          <Card style={styles.reviewsCard}>
            <View style={styles.reviewsHeader}>
              <Typography variant="h6" weight="bold">
                Reviews
              </Typography>
              <Typography variant="body2" color="primary" onPress={() => {/* View all reviews */}}>
                View All
              </Typography>
            </View>
            
            <View style={styles.reviewStats}>
              <View style={styles.ratingBig}>
                <Typography variant="h2" weight="bold" style={styles.ratingBigText}>
                  {professional.rating.toFixed(1)}
                </Typography>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star}
                      size={16} 
                      color="#FFB800"
                      fill={star <= Math.floor(professional.rating) ? "#FFB800" : "transparent"}
                    />
                  ))}
                </View>
                <Typography variant="body2" color="secondary">
                  {professional.reviews} reviews
                </Typography>
              </View>
              
              <View style={styles.reviewsInfo}>
                <Typography variant="body2" color="secondary" style={styles.reviewsText}>
                  Reviews summary will be displayed here with breakdown by rating.
                </Typography>
              </View>
            </View>
          </Card>
        </View>
        
        <View style={styles.bottomActions}>
          <Button
            title="Request a Quote"
            onPress={() => {/* Handle quote request */}}
            style={styles.mainButton}
          />
          
          <Button
            title="Send Message"
            variant="outline"
            onPress={handleMessage}
            leftIcon={<MessageCircle size={16} color={colors.primary[500]} />}
            style={styles.secondaryButton}
          />
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
  header: {
    flexDirection: 'row',
    padding: Layout.spacing.lg,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: Layout.borderRadius.circular,
  },
  headerInfo: {
    flex: 1,
    marginLeft: Layout.spacing.lg,
    justifyContent: 'center',
  },
  name: {
    marginBottom: Layout.spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.xs,
  },
  ratingText: {
    marginLeft: Layout.spacing.xs,
    marginRight: Layout.spacing.sm,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: Layout.spacing.xs,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    borderRadius: Layout.borderRadius.md,
  },
  content: {
    paddingHorizontal: Layout.spacing.lg,
  },
  specialtiesCard: {
    marginBottom: Layout.spacing.md,
  },
  cardTitle: {
    marginBottom: Layout.spacing.md,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specialtyChip: {
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.circular,
    marginRight: Layout.spacing.sm,
    marginBottom: Layout.spacing.sm,
  },
  aboutCard: {
    marginBottom: Layout.spacing.md,
  },
  bioText: {
    lineHeight: 22,
  },
  contactCard: {
    marginBottom: Layout.spacing.md,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  contactText: {
    marginLeft: Layout.spacing.md,
  },
  availabilityCard: {
    marginBottom: Layout.spacing.md,
  },
  availabilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  availabilityStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: Layout.spacing.sm,
  },
  rateText: {
    fontFamily: 'Inter-Medium',
  },
  nextAvailableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  nextAvailableText: {
    marginLeft: Layout.spacing.sm,
  },
  scheduleButton: {
    marginTop: Layout.spacing.xs,
  },
  reviewsCard: {
    marginBottom: Layout.spacing.xl,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  reviewStats: {
    flexDirection: 'row',
  },
  ratingBig: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.xl,
  },
  ratingBigText: {
    color: '#FFB800',
    marginBottom: Layout.spacing.xs,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.xs,
  },
  reviewsInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  reviewsText: {
    lineHeight: 20,
  },
  bottomActions: {
    padding: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xxl,
  },
  mainButton: {
    marginBottom: Layout.spacing.md,
  },
  secondaryButton: {
    marginBottom: Layout.spacing.md,
  },
});