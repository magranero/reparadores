import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Typography } from '@/components/common/Typography';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { diagnoses } from '@/utils/mockData';
import { Camera, Upload, Mic, Plus, ChevronRight, Search } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  Easing
} from 'react-native-reanimated';

export default function DiagnosisScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [searchQuery, setSearchQuery] = useState('');
  
  const scale = useSharedValue(1);
  
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handleCameraPress = () => {
    // Animate button press
    scale.value = withTiming(0.9, { duration: 100, easing: Easing.inOut(Easing.ease) });
    setTimeout(() => {
      scale.value = withTiming(1, { duration: 200, easing: Easing.inOut(Easing.ease) });
      router.navigate('/modals/camera');
    }, 200);
  };
  
  const handleNewDiagnosis = () => {
    router.navigate('/modals/camera');
  };

  const filteredDiagnoses = diagnoses.filter(
    diagnosis => diagnosis.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                diagnosis.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Typography variant="h4" weight="bold" style={styles.title}>Diagnosticar problemas del hogar</Typography>
          <Typography variant="body2" color="secondary" style={styles.subtitle}>
            Usa nuestra IA para diagnosticar problemas de reparación y obtener soluciones expertas.
          </Typography>
        </View>

        <View style={styles.searchBar}>
          <Search size={20} color={colors.textSecondary} />
          <TouchableOpacity 
            style={styles.searchInput}
            onPress={() => {/* Open search modal */}}
            activeOpacity={0.7}
          >
            <Typography variant="body2" color="tertiary">Buscar diagnósticos...</Typography>
          </TouchableOpacity>
        </View>

        <View style={styles.captureMethods}>
          <Animated.View style={[styles.captureButton, animatedButtonStyle]}>
            <TouchableOpacity
              style={[styles.captureButtonInner, { backgroundColor: colors.primary[500] }]}
              onPress={handleCameraPress}
              activeOpacity={0.9}
            >
              <Camera size={32} color="white" />
              <Typography variant="body2" style={styles.captureText}>Cámara</Typography>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.captureButton}>
            <TouchableOpacity
              style={[styles.captureButtonInner, { backgroundColor: colors.secondary[500] }]}
              onPress={() => {/* Handle upload */}}
              activeOpacity={0.9}
            >
              <Upload size={32} color="white" />
              <Typography variant="body2" style={styles.captureText}>Subir</Typography>
            </TouchableOpacity>
          </View>

          <View style={styles.captureButton}>
            <TouchableOpacity
              style={[styles.captureButtonInner, { backgroundColor: colors.accent[500] }]}
              onPress={() => {/* Handle voice */}}
              activeOpacity={0.9}
            >
              <Mic size={32} color="white" />
              <Typography variant="body2" style={styles.captureText}>Voz</Typography>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.diagnosisContainer}>
          <View style={styles.sectionHeader}>
            <Typography variant="h5" weight="bold">Tus diagnósticos</Typography>
            <TouchableOpacity 
              style={styles.newButton}
              onPress={handleNewDiagnosis}
            >
              <Plus size={16} color={colors.primary[500]} />
              <Typography variant="body2" style={{ color: colors.primary[500] }}>Nuevo</Typography>
            </TouchableOpacity>
          </View>

          {filteredDiagnoses.length > 0 ? (
            filteredDiagnoses.map((diagnosis) => (
              <Card 
                key={diagnosis.id} 
                style={styles.diagnosisCard}
                onPress={() => router.navigate({ pathname: `/(tabs)/diagnosis/${diagnosis.id}` })}
                animated
              >
                <View style={styles.diagnosisCardContent}>
                  <Image source={{ uri: diagnosis.imageUrl }} style={styles.diagnosisImage} />
                  
                  <View style={styles.diagnosisInfo}>
                    <View style={styles.diagnosisHeader}>
                      <Typography variant="h6" weight="medium" numberOfLines={1}>
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
                          variant="caption" 
                          style={{ 
                            color: diagnosis.status === 'completed' 
                              ? colors.success[700] 
                              : diagnosis.status === 'pending' 
                                ? colors.warning[700] 
                                : colors.primary[700],
                          }}
                        >
                          {diagnosis.status === 'completed' ? 'Completado' : 
                           diagnosis.status === 'pending' ? 'Pendiente' : 
                           diagnosis.status === 'archived' ? 'Archivado' : diagnosis.status}
                        </Typography>
                      </View>
                    </View>
                    
                    <Typography variant="body2" color="secondary" numberOfLines={2} style={styles.diagnosisDescription}>
                      {diagnosis.description}
                    </Typography>
                    
                    <View style={styles.diagnosisFooter}>
                      <Typography variant="caption" color="tertiary">
                        {new Date(diagnosis.createdAt).toLocaleDateString()}
                      </Typography>
                      
                      <ChevronRight size={16} color={colors.textTertiary} />
                    </View>
                  </View>
                </View>
              </Card>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Typography variant="body1" color="tertiary" style={styles.emptyText}>
                No se encontraron diagnósticos. Inicia un nuevo diagnóstico para obtener ayuda con tus problemas de reparación.
              </Typography>
              <Button
                title="Iniciar nuevo diagnóstico"
                onPress={handleNewDiagnosis}
                style={styles.emptyButton}
              />
            </View>
          )}
        </View>

        <View style={styles.helpSection}>
          <Card style={styles.helpCard}>
            <Typography variant="h6" weight="bold">¿No sabes por dónde empezar?</Typography>
            <Typography variant="body2" color="secondary" style={styles.helpText}>
              Nuestra IA puede ayudar a diagnosticar problemas comunes del hogar. Toma una foto, sube una imagen o describe el problema.
            </Typography>
            <Button
              title="Obtener ayuda"
              variant="outline"
              onPress={() => {/* Handle help */}}
              style={styles.helpButton}
            />
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    backgroundColor: '#F5F5F7',
    borderRadius: Layout.borderRadius.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: Layout.spacing.sm,
  },
  captureMethods: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.xl,
  },
  captureButton: {
    width: '30%',
    aspectRatio: 1,
  },
  captureButtonInner: {
    width: '100%',
    height: '100%',
    borderRadius: Layout.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...Layout.shadows.md,
  },
  captureText: {
    color: 'white',
    marginTop: Layout.spacing.sm,
    fontFamily: 'Inter-Medium',
  },
  diagnosisContainer: {
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  diagnosisCard: {
    marginBottom: Layout.spacing.md,
  },
  diagnosisCardContent: {
    flexDirection: 'row',
  },
  diagnosisImage: {
    width: 80,
    height: 80,
    borderRadius: Layout.borderRadius.sm,
  },
  diagnosisInfo: {
    flex: 1,
    marginLeft: Layout.spacing.md,
    justifyContent: 'space-between',
  },
  diagnosisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: 2,
    borderRadius: Layout.borderRadius.circular,
  },
  diagnosisDescription: {
    marginBottom: Layout.spacing.sm,
  },
  diagnosisFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  emptyButton: {
    minWidth: 200,
  },
  helpSection: {
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xxl,
  },
  helpCard: {
    backgroundColor: '#F8FAFC',
  },
  helpText: {
    marginVertical: Layout.spacing.sm,
  },
  helpButton: {
    alignSelf: 'flex-start',
    marginTop: Layout.spacing.sm,
  },
});