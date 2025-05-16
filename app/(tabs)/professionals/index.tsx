import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Image, 
  useColorScheme, 
  TextInput,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Typography } from '@/components/common/Typography';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { professionals, serviceCategories } from '@/utils/mockData';
import { Search, Star, MapPin, Filter, ChevronRight } from 'lucide-react-native';
import { useTranslation } from '@/utils/i18n';

export default function ProfessionalsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { t } = useTranslation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const handleOpenFilter = () => {
    router.navigate('/modals/filter');
  };
  
  const handleSelectCategory = (id: string) => {
    setSelectedCategory(selectedCategory === id ? null : id);
  };
  
  const filteredProfessionals = professionals.filter(pro => {
    // Filter by search query
    const matchesSearch = 
      searchQuery === '' || 
      pro.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.specialties.some(specialty => 
        specialty.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
    // Filter by category
    const matchesCategory = 
      !selectedCategory || 
      pro.specialties.some(specialty => {
        const category = serviceCategories.find(c => c.id === selectedCategory);
        return category && specialty.toLowerCase().includes(category.name.toLowerCase());
      });
      
    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Typography variant="h4" weight="bold" style={styles.title}>{t('findProfessionals')}</Typography>
          <Typography variant="body2" color="secondary" style={styles.subtitle}>
            {t('connectWithTrustedExperts')}
          </Typography>
        </View>
        
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Search size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder={t('searchByNameOrSpecialty')}
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <TouchableOpacity
            style={[styles.filterButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={handleOpenFilter}
          >
            <Filter size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {serviceCategories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: selectedCategory === category.id ? colors.primary[500] : colors.card,
                  borderColor: colors.border,
                }
              ]}
              onPress={() => handleSelectCategory(category.id)}
            >
              <Typography
                variant="body2"
                weight="medium"
                style={{
                  color: selectedCategory === category.id ? 'white' : colors.text,
                }}
              >
                {category.name}
              </Typography>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <View style={styles.resultContainer}>
          <Typography variant="body2" color="secondary" style={styles.resultCount}>
            {filteredProfessionals.length} {t('professionalsFound')}
          </Typography>
          
          {filteredProfessionals.map(pro => (
            <Card 
              key={pro.id}
              style={styles.proCard}
              onPress={() => router.navigate(`/(tabs)/professionals/${pro.id}`)}
              animated
            >
              <View style={styles.proCardHeader}>
                <Image source={{ uri: pro.profileImageUrl }} style={styles.proImage} />
                
                <View style={styles.proInfo}>
                  <Typography variant="h6" weight="medium">
                    {pro.name}
                  </Typography>
                  
                  <View style={styles.specialtiesContainer}>
                    {pro.specialties.slice(0, 2).map((specialty, index) => (
                      <View 
                        key={index} 
                        style={[styles.specialtyChip, { backgroundColor: colors.primary[50] }]}
                      >
                        <Typography 
                          variant="caption" 
                          style={{ color: colors.primary[700] }}
                        >
                          {specialty}
                        </Typography>
                      </View>
                    ))}
                    {pro.specialties.length > 2 && (
                      <Typography variant="caption" color="tertiary">
                        +{pro.specialties.length - 2} {t('more')}
                      </Typography>
                    )}
                  </View>
                  
                  <View style={styles.ratingContainer}>
                    <Star size={16} color="#FFB800" fill="#FFB800" />
                    <Typography variant="body2" weight="medium" style={styles.ratingText}>
                      {pro.rating.toFixed(1)}
                    </Typography>
                    <Typography variant="caption" color="tertiary">
                      ({pro.reviews} {t('reviews')})
                    </Typography>
                  </View>
                </View>
                
                <ChevronRight size={20} color={colors.textTertiary} style={styles.chevron} />
              </View>
              
              <View style={styles.proCardFooter}>
                <View style={styles.locationContainer}>
                  <MapPin size={14} color={colors.textSecondary} />
                  <Typography variant="caption" color="secondary" style={styles.locationText}>
                    {pro.location} • {pro.distance}
                  </Typography>
                </View>
                
                <View 
                  style={[
                    styles.availabilityBadge,
                    { 
                      backgroundColor: 
                        pro.availability.status === 'available' 
                          ? colors.success[100]
                          : pro.availability.status === 'limited'
                            ? colors.warning[100]
                            : colors.error[100]
                    }
                  ]}
                >
                  <Typography 
                    variant="caption"
                    style={{ 
                      color: 
                        pro.availability.status === 'available' 
                          ? colors.success[700]
                          : pro.availability.status === 'limited'
                            ? colors.warning[700]
                            : colors.error[700]
                    }}
                  >
                    {pro.availability.status === 'available' 
                      ? t('availableNow')
                      : pro.availability.status === 'limited'
                        ? t('limitedAvailability')
                        : t('unavailable')}
                  </Typography>
                </View>
              </View>
              
              <View style={styles.proCardActions}>
                <Button
                  title={t('viewProfile')}
                  variant="outline"
                  size="sm"
                  onPress={() => router.navigate(`/(tabs)/professionals/${pro.id}`)}
                  style={styles.viewButton}
                />
                
                <Button
                  title={t('contact')}
                  size="sm"
                  onPress={() => {/* Handle contact */}}
                />
              </View>
            </Card>
          ))}
          
          {filteredProfessionals.length === 0 && (
            <View style={styles.emptyState}>
              <Typography variant="body1" color="tertiary" style={styles.emptyText}>
                {t('noProfessionalsFound')}
              </Typography>
              <Button
                title={t('clearFilters')}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                }}
                style={styles.clearButton}
              />
            </View>
          )}
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
  header: {
    padding: Layout.spacing.lg,
    paddingBottom: Layout.spacing.md,
  },
  title: {
    marginBottom: Layout.spacing.xs,
  },
  subtitle: {
    maxWidth: '90%',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    marginRight: Layout.spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: Layout.spacing.sm,
    fontFamily: 'Inter-Regular',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: Layout.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  categoriesContainer: {
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
  },
  categoryChip: {
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.circular,
    marginRight: Layout.spacing.sm,
    borderWidth: 1,
  },
  resultContainer: {
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xxl,
  },
  resultCount: {
    marginBottom: Layout.spacing.md,
  },
  proCard: {
    marginBottom: Layout.spacing.lg,
  },
  proCardHeader: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.md,
  },
  proImage: {
    width: 70,
    height: 70,
    borderRadius: Layout.borderRadius.circular,
  },
  proInfo: {
    flex: 1,
    marginLeft: Layout.spacing.md,
    justifyContent: 'space-between',
  },
  specialtiesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginVertical: Layout.spacing.xs,
  },
  specialtyChip: {
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: 2,
    borderRadius: Layout.borderRadius.circular,
    marginRight: Layout.spacing.xs,
    marginBottom: Layout.spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: Layout.spacing.xs,
    marginRight: Layout.spacing.sm,
  },
  chevron: {
    alignSelf: 'center',
  },
  proCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: Layout.spacing.xs,
  },
  availabilityBadge: {
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: 4,
    borderRadius: Layout.borderRadius.circular,
  },
  proCardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewButton: {
    flex: 1,
    marginRight: Layout.spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.xl,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: Layout.spacing.lg,
    paddingHorizontal: Layout.spacing.md,
  },
  clearButton: {
    minWidth: 150,
  },
});