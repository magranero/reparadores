import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '@/components/common/Typography';
import { Card } from '@/components/common/Card';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { router } from 'expo-router';
import { X, Check, Globe } from 'lucide-react-native';
import { useTranslation, SUPPORTED_LANGUAGES } from '@/utils/i18n';

export default function LanguageModal() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { locale, setLocale, t } = useTranslation();

  const handleSelectLanguage = async (languageCode: string) => {
    await setLocale(languageCode);
    router.back();
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Typography variant="h5" weight="bold">{t('selectLanguage')}</Typography>
        <TouchableOpacity
          style={[styles.closeButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={handleClose}
        >
          <X size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Card style={styles.languagesCard}>
          <View style={styles.cardHeader}>
            <Globe size={20} color={colors.primary[500]} />
            <Typography variant="body1" weight="medium" style={styles.cardHeaderText}>
              {t('selectLanguage')}
            </Typography>
          </View>

          {Object.entries(SUPPORTED_LANGUAGES).map(([code, language]) => (
            <TouchableOpacity
              key={code}
              style={[
                styles.languageItem,
                locale === code && { 
                  backgroundColor: colors.primary[50],
                  borderColor: colors.primary[500],
                },
                { borderColor: colors.border }
              ]}
              onPress={() => handleSelectLanguage(code)}
            >
              <View>
                <Typography variant="body1" weight="medium">
                  {language.nativeName}
                </Typography>
                <Typography variant="caption" color="secondary">
                  {language.name}
                </Typography>
              </View>
              {locale === code && (
                <Check size={20} color={colors.primary[500]} />
              )}
            </TouchableOpacity>
          ))}
        </Card>
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
  languagesCard: {
    marginHorizontal: Layout.spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  cardHeaderText: {
    marginLeft: Layout.spacing.sm,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Layout.spacing.md,
    borderWidth: 1,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.sm,
  },
});