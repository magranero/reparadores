import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Switch, useColorScheme, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '@/components/common/Typography';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { User, Settings, Bell, Moon, Globe, Shield, CircleHelp as HelpCircle, LogOut, CreditCard as Edit3, ChevronRight, Camera } from 'lucide-react-native';
import { useTranslation, SUPPORTED_LANGUAGES } from '@/utils/i18n';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  
  const profileData = {
    name: 'Samantha Johnson',
    email: 'samantha.j@example.com',
    phone: '(555) 123-4567',
    address: '123 Main Street, Portland, OR 97201',
    profileImageUrl: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  };
  
  const { t, locale } = useTranslation();
  
  const handleLanguageChange = () => {
    router.push('/modals/language');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Typography variant="h4" weight="bold">{t('profile')}</Typography>
          <TouchableOpacity 
            style={[styles.settingsButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Settings size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: profileData.profileImageUrl }} 
              style={styles.profileImage} 
            />
            <TouchableOpacity 
              style={[styles.editImageButton, { backgroundColor: colors.primary[500] }]}
            >
              <Camera size={16} color="white" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            <Typography variant="h5" weight="bold" style={styles.profileName}>
              {profileData.name}
            </Typography>
            <Typography variant="body2" color="secondary" style={styles.profileEmail}>
              {profileData.email}
            </Typography>
            <Button
              title={t('edit')}
              variant="outline"
              size="sm"
              leftIcon={<Edit3 size={16} color={colors.primary[500]} />}
              style={styles.editButton}
            />
          </View>
        </View>
        
        <Card style={styles.infoCard}>
          <Typography variant="h6" weight="bold" style={styles.cardTitle}>
            {t('contactInformation')}
          </Typography>
          
          <View style={styles.infoItem}>
            <Typography variant="body2" color="secondary">
              {t('phone')}
            </Typography>
            <Typography variant="body2">
              {profileData.phone}
            </Typography>
          </View>
          
          <View style={styles.infoItem}>
            <Typography variant="body2" color="secondary">
              {t('email')}
            </Typography>
            <Typography variant="body2">
              {profileData.email}
            </Typography>
          </View>
          
          <View style={styles.infoItem}>
            <Typography variant="body2" color="secondary">
              {t('address')}
            </Typography>
            <Typography variant="body2" style={styles.addressText}>
              {profileData.address}
            </Typography>
          </View>
        </Card>
        
        <Card style={styles.preferencesCard}>
          <Typography variant="h6" weight="bold" style={styles.cardTitle}>
            {t('preferences')}
          </Typography>
          
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Bell size={20} color={colors.primary[500]} />
              <Typography variant="body2" style={styles.preferenceName}>
                {t('notifications')}
              </Typography>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primary[500] }}
              thumbColor="white"
            />
          </View>
          
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Moon size={20} color={colors.primary[500]} />
              <Typography variant="body2" style={styles.preferenceName}>
                {t('darkMode')}
              </Typography>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: colors.border, true: colors.primary[500] }}
              thumbColor="white"
            />
          </View>
          
          <TouchableOpacity 
            style={styles.preferenceItem}
            onPress={handleLanguageChange}
          >
            <View style={styles.preferenceInfo}>
              <Globe size={20} color={colors.primary[500]} />
              <Typography variant="body2" style={styles.preferenceName}>
                {t('language')}
              </Typography>
            </View>
            <View style={styles.languageSelector}>
              <Typography variant="body2" color="secondary">
                {SUPPORTED_LANGUAGES[locale].nativeName}
              </Typography>
              <ChevronRight size={16} color={colors.textTertiary} />
            </View>
          </TouchableOpacity>
        </Card>
        
        <Card style={styles.supportCard}>
          <Typography variant="h6" weight="bold" style={styles.cardTitle}>
            {t('support')}
          </Typography>
          
          <TouchableOpacity style={styles.supportItem}>
            <View style={styles.supportInfo}>
              <Shield size={20} color={colors.primary[500]} />
              <Typography variant="body2" style={styles.supportName}>
                {t('privacyPolicy')}
              </Typography>
            </View>
            <ChevronRight size={16} color={colors.textTertiary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.supportItem}>
            <View style={styles.supportInfo}>
              <HelpCircle size={20} color={colors.primary[500]} />
              <Typography variant="body2" style={styles.supportName}>
                {t('helpSupport')}
              </Typography>
            </View>
            <ChevronRight size={16} color={colors.textTertiary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.supportItem}>
            <View style={styles.supportInfo}>
              <User size={20} color={colors.primary[500]} />
              <Typography variant="body2" style={styles.supportName}>
                {t('aboutUs')}
              </Typography>
            </View>
            <ChevronRight size={16} color={colors.textTertiary} />
          </TouchableOpacity>
          
          <Button
            title={t('logOut')}
            variant="outline"
            leftIcon={<LogOut size={16} color={colors.error[500]} />}
            style={[styles.logoutButton, { borderColor: colors.error[500] }]}
          />
        </Card>
        
        <View style={styles.appInfoContainer}>
          <Typography variant="caption" color="tertiary" style={styles.appVersion}>
            FixFinder v1.0.0
          </Typography>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Layout.spacing.lg,
    paddingBottom: Layout.spacing.md,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: Layout.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  profileSection: {
    flexDirection: 'row',
    padding: Layout.spacing.lg,
    paddingTop: 0,
    paddingBottom: Layout.spacing.xl,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: Layout.borderRadius.circular,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: Layout.borderRadius.circular,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: Layout.spacing.lg,
    justifyContent: 'center',
  },
  profileName: {
    marginBottom: 2,
  },
  profileEmail: {
    marginBottom: Layout.spacing.sm,
  },
  editButton: {
    alignSelf: 'flex-start',
  },
  infoCard: {
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  cardTitle: {
    marginBottom: Layout.spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.sm,
  },
  addressText: {
    textAlign: 'right',
    maxWidth: '60%',
  },
  preferencesCard: {
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  preferenceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preferenceName: {
    marginLeft: Layout.spacing.md,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  supportCard: {
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
  },
  supportItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  supportInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  supportName: {
    marginLeft: Layout.spacing.md,
  },
  logoutButton: {
    marginTop: Layout.spacing.sm,
  },
  appInfoContainer: {
    alignItems: 'center',
    marginBottom: Layout.spacing.xxl,
  },
  appVersion: {
    textAlign: 'center',
  },
});