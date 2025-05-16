import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, useColorScheme, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '@/components/common/Typography';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { serviceCategories } from '@/utils/mockData';
import { router } from 'expo-router';
import { X, Check, MapPin, Star, DollarSign } from 'lucide-react-native';
import { useTranslation } from '@/utils/i18n';

export default function FilterModal() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { t } = useTranslation();
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDistance, setSelectedDistance] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  
  const distances = [
    { id: '5mi', label: t('within5Miles') },
    { id: '10mi', label: t('within10Miles') },
    { id: '25mi', label: t('within25Miles') },
    { id: 'any', label: t('anyDistance') },
  ];
  
  const ratings = [4, 3, 2, 1];
  
  const priceRanges = [
    { id: 'low', label: t('budgetPrice') },
    { id: 'medium', label: t('averagePrice') },
    { id: 'high', label: t('premiumPrice') },
  ];
  
  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };
  
  const toggleDistance = (distanceId: string) => {
    if (selectedDistance === distanceId) {
      setSelectedDistance(null);
    } else {
      setSelectedDistance(distanceId);
    }
  };
  
  const toggleRating = (rating: number) => {
    if (selectedRating === rating) {
      setSelectedRating(null);
    } else {
      setSelectedRating(rating);
    }
  };
  
  const togglePriceRange = (priceId: string) => {
    if (selectedPriceRange === priceId) {
      setSelectedPriceRange(null);
    } else {
      setSelectedPriceRange(priceId);
    }
  };
  
  const handleApplyFilters = () => {
    // In a real app, we would pass these filter values back to the professionals screen
    // For now, we'll just close the modal
    router.back();
  };
  
  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedDistance(null);
    setSelectedRating(null);
    setSelectedPriceRange(null);
  };
  
  const handleClose = () => {
    router.back();
  };
  
  const hasActiveFilters = selectedCategories.length > 0 || 
    selectedDistance !== null || 
    selectedRating !== null || 
    selectedPriceRange !== null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Typography variant="h5" weight="bold">{t('filterProfessionals')}</Typography>
        <TouchableOpacity
          style={[styles.closeButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={handleClose}
        >
          <X size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Card style={styles.filterSection}>
          <Typography variant="h6" weight="bold" style={styles.sectionTitle}>
            {t('serviceCategories')}
          </Typography>
          
          <View style={styles.categoriesGrid}>
            {serviceCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryItem,
                  selectedCategories.includes(category.id) && { 
                    backgroundColor: colors.primary[50],
                    borderColor: colors.primary[500],
                  },
                  { borderColor: colors.border }
                ]}
                onPress={() => toggleCategory(category.id)}
              >
                <Typography 
                  variant="body2" 
                  style={{ 
                    color: selectedCategories.includes(category.id) ? colors.primary[700] : colors.text
                  }}
                >
                  {category.name}
                </Typography>
                {selectedCategories.includes(category.id) && (
                  <Check size={16} color={colors.primary[500]} style={styles.checkIcon} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Card>
        
        <Card style={styles.filterSection}>
          <View style={styles.sectionHeader}>
            <Typography variant="h6" weight="bold">
              {t('distance')}
            </Typography>
            <MapPin size={20} color={colors.primary[500]} />
          </View>
          
          <View style={styles.optionsContainer}>
            {distances.map((distance) => (
              <TouchableOpacity
                key={distance.id}
                style={[
                  styles.optionItem,
                  selectedDistance === distance.id && { 
                    backgroundColor: colors.primary[50],
                    borderColor: colors.primary[500],
                  },
                  { borderColor: colors.border }
                ]}
                onPress={() => toggleDistance(distance.id)}
              >
                <Typography 
                  variant="body2"
                  style={{ 
                    color: selectedDistance === distance.id ? colors.primary[700] : colors.text
                  }}
                >
                  {distance.label}
                </Typography>
                {selectedDistance === distance.id && (
                  <Check size={16} color={colors.primary[500]} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Card>
        
        <Card style={styles.filterSection}>
          <View style={styles.sectionHeader}>
            <Typography variant="h6" weight="bold">
              {t('minimumRating')}
            </Typography>
            <Star size={20} color={colors.primary[500]} />
          </View>
          
          <View style={styles.ratingsContainer}>
            {ratings.map((rating) => (
              <TouchableOpacity
                key={rating}
                style={[
                  styles.ratingItem,
                  selectedRating === rating && { 
                    backgroundColor: colors.primary[50],
                    borderColor: colors.primary[500],
                  },
                  { borderColor: colors.border }
                ]}
                onPress={() => toggleRating(rating)}
              >
                <Typography 
                  variant="body1" 
                  weight="bold"
                  style={{ 
                    color: selectedRating === rating ? colors.primary[700] : colors.text
                  }}
                >
                  {rating}+
                </Typography>
                <View style={styles.starsContainer}>
                  {[...Array(rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      color="#FFB800" 
                      fill="#FFB800" 
                    />
                  ))}
                  {[...Array(5 - rating)].map((_, i) => (
                    <Star 
                      key={i + rating} 
                      size={16} 
                      color="#E5E7EB" 
                      fill="#E5E7EB"
                    />
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Card>
        
        <Card style={styles.filterSection}>
          <View style={styles.sectionHeader}>
            <Typography variant="h6" weight="bold">
              {t('priceRange')}
            </Typography>
            <DollarSign size={20} color={colors.primary[500]} />
          </View>
          
          <View style={styles.optionsContainer}>
            {priceRanges.map((price) => (
              <TouchableOpacity
                key={price.id}
                style={[
                  styles.optionItem,
                  selectedPriceRange === price.id && { 
                    backgroundColor: colors.primary[50],
                    borderColor: colors.primary[500],
                  },
                  { borderColor: colors.border }
                ]}
                onPress={() => togglePriceRange(price.id)}
              >
                <Typography 
                  variant="body2"
                  style={{ 
                    color: selectedPriceRange === price.id ? colors.primary[700] : colors.text
                  }}
                >
                  {price.label}
                </Typography>
                {selectedPriceRange === price.id && (
                  <Check size={16} color={colors.primary[500]} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Card>
      </ScrollView>
      
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        {hasActiveFilters && (
          <Button
            title={t('resetAll')}
            variant="outline"
            size="md"
            onPress={handleResetFilters}
            style={styles.resetButton}
          />
        )}
        <Button
          title={t('applyFilters')}
          size="md"
          onPress={handleApplyFilters}
          style={styles.applyButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Layout.spacing.lg,
    paddingBottom: Layout.spacing.md,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: Layout.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  scrollView: {
    flex: 1,
  },
  filterSection: {
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  sectionTitle: {
    marginBottom: Layout.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.spacing.sm,
  },
  categoryItem: {
    borderWidth: 1,
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    minWidth: '30%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  checkIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  optionsContainer: {
    gap: Layout.spacing.sm,
  },
  optionItem: {
    borderWidth: 1,
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.spacing.sm,
  },
  ratingItem: {
    borderWidth: 1,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.sm,
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '23%',
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: Layout.spacing.xs,
  },
  footer: {
    padding: Layout.spacing.lg,
    borderTopWidth: 1,
    flexDirection: 'row',
  },
  resetButton: {
    flex: 1,
    marginRight: Layout.spacing.md,
  },
  applyButton: {
    flex: 2,
  },
});