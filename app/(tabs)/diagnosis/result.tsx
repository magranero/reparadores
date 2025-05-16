import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Image, 
  useColorScheme, 
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Typography } from '@/components/common/Typography';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { SquareTerminal as TerminalSquare, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle2, PenTool as Tools, ShoppingBag, Share2, Clock, MessageCircle, Mic, X, Tool, User, ExternalLink, MapPin, Youtube } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing,
  FadeInDown,
  FadeInLeft
} from 'react-native-reanimated';
import * as Speech from 'expo-speech';

export default function DiagnosisResultScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const [analysisState, setAnalysisState] = useState<'loading' | 'success' | 'error'>('loading');
  const [progress, setProgress] = useState(0);
  const [showDiscussionModal, setShowDiscussionModal] = useState(false);
  const [discussionText, setDiscussionText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [selectedOption, setSelectedOption] = useState<'diy' | 'professional' | null>(null);
  
  const progressAnimation = useSharedValue(0);
  
  // Mock analysis result
  const analysisResult = {
    issue: 'Conexión dañada del sifón',
    severity: 'medium',
    recommendedActions: [
      'Reemplazar el conjunto del sifón',
      'Revisar las tuberías conectadas para detectar corrosión',
      'Aplicar sellador de roscas en las conexiones'
    ],
    requiredParts: [
      {
        id: 'p1',
        name: 'Kit de montaje de sifón',
        estimatedCost: '15-25€',
        availabilityStatus: 'in-stock',
        affiliateLink: 'https://www.leroymerlin.es/fp/82174592/kit-de-sifon-para-fregadero',
        amazonLink: 'https://www.amazon.es/Kibros-301B-Sif%C3%B3n-botella-extensible/dp/B0144NMRKI/'
      },
      {
        id: 'p2',
        name: 'Sellador de roscas para tuberías',
        estimatedCost: '5-10€',
        availabilityStatus: 'in-stock',
        affiliateLink: 'https://www.leroymerlin.es/fp/82123410/cinta-de-teflon-para-fontaneria',
        amazonLink: 'https://www.amazon.es/Cinta-Teflon-Fontaneria-Metros-Unidades/dp/B0BG5LQ31X/'
      }
    ],
    tutorials: [
      {
        title: 'Cómo cambiar un sifón de fregadero',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      },
      {
        title: 'Reparación de fugas en tuberías',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail: 'https://images.pexels.com/photos/6419096/pexels-photo-6419096.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      }
    ],
    professionals: [
      {
        id: '1',
        name: 'Alex Rivera',
        specialty: 'Fontanería',
        rating: 4.8,
        distance: '3.2 km',
        imageUrl: 'https://images.pexels.com/photos/8961065/pexels-photo-8961065.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      },
      {
        id: '2',
        name: 'Sofia Chen',
        specialty: 'Fontanería y Reformas',
        rating: 4.9,
        distance: '5.7 km',
        imageUrl: 'https://images.pexels.com/photos/3791136/pexels-photo-3791136.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      }
    ]
  };
  
  // Simulate AI analysis
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const startTimer = () => {
      timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(() => {
              setAnalysisState('success');
            }, 500);
            return 100;
          }
          return prev + 5;
        });
      }, 300);
    };
    
    startTimer();
    
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    progressAnimation.value = withTiming(progress / 100, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [progress, progressAnimation]);
  
  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progress}%`,
    };
  });
  
  const handleFindProfessionals = () => {
    setSelectedOption('professional');
  };
  
  const handleFixMyself = () => {
    setSelectedOption('diy');
  };
  
  const handleShare = () => {
    // Función de compartir
    Alert.alert('Compartir', 'Compartiendo el diagnóstico...');
  };
  
  const handleRetry = () => {
    setAnalysisState('loading');
    setProgress(0);
    setSelectedOption(null);
    
    // Restart analysis simulation
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setAnalysisState('success');
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 300);
  };
  
  const handleOpenDiscussion = () => {
    setShowDiscussionModal(true);
  };
  
  const handleCloseDiscussion = () => {
    setShowDiscussionModal(false);
  };
  
  const handleViewProfessional = (id: string) => {
    router.push(`/(tabs)/professionals/${id}`);
  };
  
  const handleOpenTutorial = (url: string) => {
    Linking.openURL(url);
  };
  
  const handleSendDiscussion = () => {
    if (discussionText.trim() === '') return;
    
    // Simulamos una respuesta de la IA
    setTimeout(() => {
      setAiResponse('Entiendo tu preocupación. Basado en la imagen y tu descripción, sigo considerando que el problema es con el sifón, pero también revisaré si hay problemas adicionales en las conexiones de suministro de agua. ¿Hay algún otro detalle que quieras compartir?');
    }, 1500);
  };
  
  const speakText = (text: string) => {
    Speech.speak(text, {
      language: 'es',
      pitch: 1.0,
      rate: 0.9,
    });
  };
  
  const handleBuyPart = (url: string) => {
    Linking.openURL(url);
  };
  
  const renderSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle size={24} color={colors.error[500]} />;
      case 'medium':
        return <AlertTriangle size={24} color={colors.warning[500]} />;
      case 'low':
        return <CheckCircle2 size={24} color={colors.success[500]} />;
      default:
        return null;
    }
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return colors.error[500];
      case 'medium':
        return colors.warning[500];
      case 'low':
        return colors.success[500];
      default:
        return colors.primary[500];
    }
  };
  
  const getSeverityBackground = (severity: string) => {
    switch (severity) {
      case 'high':
        return colors.error[50];
      case 'medium':
        return colors.warning[50];
      case 'low':
        return colors.success[50];
      default:
        return colors.primary[50];
    }
  };

  const renderOptionScreen = () => {
    if (selectedOption === 'diy') {
      return (
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            entering={FadeInDown.duration(500).delay(200)}
            style={styles.diyHeader}
          >
            <Tool size={48} color={colors.primary[500]} />
            <Typography variant="h5" weight="bold" style={styles.diyTitle}>
              Reparación DIY
            </Typography>
            <Typography variant="body2" color="secondary" style={styles.diySubtitle}>
              Todo lo que necesitas para arreglar este problema por ti mismo
            </Typography>
          </Animated.View>
          
          <Animated.View 
            entering={FadeInDown.duration(500).delay(400)}
          >
            <Typography variant="h6" weight="bold" style={styles.sectionTitle}>
              Materiales necesarios
            </Typography>
            
            <Card style={styles.materialsCard}>
              {analysisResult.requiredParts.map((part, index) => (
                <Animated.View 
                  key={part.id}
                  style={styles.materialItem}
                  entering={FadeInLeft.duration(300).delay(500 + index * 100)}
                >
                  <View style={styles.materialInfo}>
                    <Typography variant="body1" weight="medium">
                      {part.name}
                    </Typography>
                    <Typography variant="caption" color="secondary">
                      Coste est.: {part.estimatedCost}
                    </Typography>
                  </View>
                  
                  <View style={styles.materialLinks}>
                    <TouchableOpacity
                      style={[styles.materialButton, { backgroundColor: colors.primary[500] }]}
                      onPress={() => handleBuyPart(part.affiliateLink)}
                    >
                      <ExternalLink size={16} color="white" />
                      <Typography variant="caption" style={styles.materialButtonText}>
                        Ver en tienda
                      </Typography>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.materialButton, { backgroundColor: colors.secondary[500] }]}
                      onPress={() => handleBuyPart(part.amazonLink)}
                    >
                      <ExternalLink size={16} color="white" />
                      <Typography variant="caption" style={styles.materialButtonText}>
                        Amazon
                      </Typography>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              ))}
            </Card>
          </Animated.View>
          
          <Animated.View
            entering={FadeInDown.duration(500).delay(600)}
          >
            <Typography variant="h6" weight="bold" style={styles.sectionTitle}>
              Tutoriales recomendados
            </Typography>
            
            <View style={styles.tutorialsContainer}>
              {analysisResult.tutorials.map((tutorial, index) => (
                <Card 
                  key={index}
                  style={styles.tutorialCard}
                  onPress={() => handleOpenTutorial(tutorial.url)}
                >
                  <Image 
                    source={{ uri: tutorial.thumbnail }}
                    style={styles.tutorialImage}
                  />
                  <View style={styles.tutorialOverlay}>
                    <Youtube size={32} color="white" />
                  </View>
                  <View style={styles.tutorialInfo}>
                    <Typography variant="body1" weight="medium">
                      {tutorial.title}
                    </Typography>
                    <TouchableOpacity
                      style={styles.tutorialButton}
                      onPress={() => handleOpenTutorial(tutorial.url)}
                    >
                      <Typography 
                        variant="caption" 
                        style={{ color: colors.primary[500] }}
                      >
                        Ver tutorial
                      </Typography>
                      <ExternalLink size={14} color={colors.primary[500]} style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                  </View>
                </Card>
              ))}
            </View>
          </Animated.View>
          
          <Animated.View
            entering={FadeInDown.duration(500).delay(800)}
          >
            <Typography variant="h6" weight="bold" style={styles.sectionTitle}>
              Instrucciones de reparación
            </Typography>
            
            <Card style={styles.instructionsCard}>
              {analysisResult.recommendedActions.map((action, index) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={[styles.instructionNumber, { backgroundColor: colors.primary[500] }]}>
                    <Typography variant="caption" style={styles.instructionNumberText}>
                      {index + 1}
                    </Typography>
                  </View>
                  <Typography variant="body2" style={styles.instructionText}>
                    {action}
                  </Typography>
                </View>
              ))}
            </Card>
          </Animated.View>
          
          <Animated.View
            style={styles.diyFooter}
            entering={FadeInDown.duration(500).delay(1000)}
          >
            <Typography variant="body2" color="secondary" style={styles.diyFooterText}>
              ¿No te sientes seguro haciendo esta reparación por ti mismo?
            </Typography>
            <Button
              title="Encontrar profesionales"
              variant="outline"
              onPress={handleFindProfessionals}
              style={styles.diyFooterButton}
            />
          </Animated.View>
        </ScrollView>
      );
    } else if (selectedOption === 'professional') {
      return (
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            entering={FadeInDown.duration(500).delay(200)}
            style={styles.proHeader}
          >
            <User size={48} color={colors.primary[500]} />
            <Typography variant="h5" weight="bold" style={styles.proTitle}>
              Profesionales recomendados
            </Typography>
            <Typography variant="body2" color="secondary" style={styles.proSubtitle}>
              Expertos cerca de ti que pueden solucionar este problema
            </Typography>
          </Animated.View>
          
          <Animated.View 
            entering={FadeInDown.duration(500).delay(400)}
          >
            <Card style={styles.problemSummaryCard}>
              <Typography variant="h6" weight="bold" style={{ marginBottom: 8 }}>
                Problema a resolver
              </Typography>
              <Typography variant="body2" color="secondary">
                {analysisResult.issue}
              </Typography>
              <View 
                style={[
                  styles.severityBadge,
                  { 
                    backgroundColor: getSeverityBackground(analysisResult.severity),
                    alignSelf: 'flex-start',
                    marginTop: 8
                  }
                ]}
              >
                {renderSeverityIcon(analysisResult.severity)}
                <Typography 
                  variant="caption" 
                  weight="medium"
                  style={[
                    styles.severityText,
                    { color: getSeverityColor(analysisResult.severity) }
                  ]}
                >
                  SEVERIDAD {analysisResult.severity === 'high' ? 'ALTA' : analysisResult.severity === 'medium' ? 'MEDIA' : 'BAJA'}
                </Typography>
              </View>
            </Card>
          </Animated.View>
          
          <Animated.View
            entering={FadeInDown.duration(500).delay(600)}
          >
            <Typography variant="h6" weight="bold" style={styles.sectionTitle}>
              Profesionales disponibles
            </Typography>
            
            {analysisResult.professionals.map((pro, index) => (
              <Card 
                key={pro.id}
                style={styles.proCard}
                onPress={() => handleViewProfessional(pro.id)}
              >
                <View style={styles.proCardContent}>
                  <Image 
                    source={{ uri: pro.imageUrl }} 
                    style={styles.proImage}
                  />
                  <View style={styles.proInfo}>
                    <Typography variant="h6" weight="medium">
                      {pro.name}
                    </Typography>
                    <Typography variant="body2" color="secondary">
                      {pro.specialty}
                    </Typography>
                    <View style={styles.proMetaInfo}>
                      <View style={styles.proRating}>
                        <Star size={16} color="#FFB800" fill="#FFB800" />
                        <Typography variant="caption" weight="medium" style={styles.proRatingText}>
                          {pro.rating}
                        </Typography>
                      </View>
                      <View style={styles.proDistance}>
                        <MapPin size={16} color={colors.textSecondary} />
                        <Typography variant="caption" color="secondary" style={styles.proDistanceText}>
                          {pro.distance}
                        </Typography>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.proCardActions}>
                  <Button
                    title="Ver perfil"
                    variant="outline"
                    size="sm"
                    onPress={() => handleViewProfessional(pro.id)}
                    style={styles.proActionButton}
                  />
                  <Button
                    title="Solicitar presupuesto"
                    size="sm"
                    onPress={() => handleViewProfessional(pro.id)}
                  />
                </View>
              </Card>
            ))}
          </Animated.View>
          
          <Animated.View
            style={styles.proFooter}
            entering={FadeInDown.duration(500).delay(800)}
          >
            <Typography variant="body2" color="secondary" style={styles.proFooterText}>
              ¿Prefieres intentar arreglarlo por ti mismo?
            </Typography>
            <Button
              title="Ver materiales y guía"
              variant="outline"
              onPress={handleFixMyself}
              style={styles.proFooterButton}
            />
          </Animated.View>
        </ScrollView>
      );
    }
    
    // Si no hay opción seleccionada, mostrar las opciones iniciales
    return (
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={styles.successHeader}
          entering={FadeInDown.duration(500).delay(200)}
        >
          <CheckCircle2 size={48} color={colors.success[500]} />
          <Typography variant="h5" weight="bold" style={styles.successTitle}>
            Análisis completado
          </Typography>
          <Typography variant="body2" color="secondary" style={styles.successText}>
            Hemos identificado el problema y tenemos recomendaciones para ti.
          </Typography>
          
          <TouchableOpacity
            style={styles.discussButton}
            onPress={handleOpenDiscussion}
          >
            <MessageCircle size={16} color={colors.primary[500]} />
            <Typography variant="body2" style={{ color: colors.primary[500], marginLeft: 8 }}>
              Discutir este diagnóstico
            </Typography>
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View 
          entering={FadeInDown.duration(500).delay(400)}
        >
          <Card style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Typography variant="h6" weight="bold">
                Problema identificado
              </Typography>
              <View 
                style={[
                  styles.severityBadge,
                  { backgroundColor: getSeverityBackground(analysisResult.severity) }
                ]}
              >
                {renderSeverityIcon(analysisResult.severity)}
                <Typography 
                  variant="caption" 
                  weight="medium"
                  style={[
                    styles.severityText,
                    { color: getSeverityColor(analysisResult.severity) }
                  ]}
                >
                  SEVERIDAD {analysisResult.severity === 'high' ? 'ALTA' : analysisResult.severity === 'medium' ? 'MEDIA' : 'BAJA'}
                </Typography>
              </View>
            </View>
            
            <View style={styles.issueContainer}>
              <Typography variant="body1" weight="medium" style={styles.issueText}>
                {analysisResult.issue}
              </Typography>
              <TouchableOpacity
                style={styles.speakButton}
                onPress={() => speakText(analysisResult.issue)}
              >
                <Mic size={16} color={colors.primary[500]} />
              </TouchableOpacity>
            </View>
          </Card>
        </Animated.View>
        
        <Animated.View 
          entering={FadeInDown.duration(500).delay(600)}
        >
          <Typography variant="h6" weight="bold" style={styles.sectionTitle}>
            ¿Cómo quieres solucionar este problema?
          </Typography>
          
          <View style={styles.optionsContainer}>
            <Card 
              style={styles.optionCard}
              onPress={handleFixMyself}
            >
              <View style={styles.optionIconContainer}>
                <Tool size={48} color={colors.primary[500]} />
              </View>
              <Typography variant="h6" weight="bold" style={styles.optionTitle}>
                Lo quiero arreglar yo mismo
              </Typography>
              <Typography variant="body2" color="secondary" style={styles.optionDescription}>
                Te proporcionaremos una lista de materiales, tutoriales y pasos para que puedas solucionar el problema.
              </Typography>
              <Button
                title="Ver materiales y guía"
                onPress={handleFixMyself}
                style={styles.optionButton}
              />
            </Card>
            
            <Card 
              style={styles.optionCard}
              onPress={handleFindProfessionals}
            >
              <View style={styles.optionIconContainer}>
                <User size={48} color={colors.primary[500]} />
              </View>
              <Typography variant="h6" weight="bold" style={styles.optionTitle}>
                Quiero un profesional
              </Typography>
              <Typography variant="body2" color="secondary" style={styles.optionDescription}>
                Te mostraremos profesionales cualificados cerca de ti que pueden resolver este problema.
              </Typography>
              <Button
                title="Encontrar profesionales"
                onPress={handleFindProfessionals}
                style={styles.optionButton}
              />
            </Card>
          </View>
        </Animated.View>
        
        <Animated.View 
          style={styles.actionButtons}
          entering={FadeInDown.duration(500).delay(1000)}
        >
          <Button
            title="Compartir resultados"
            variant="outline"
            onPress={handleShare}
            leftIcon={<Share2 size={16} color={colors.primary[500]} />}
            style={styles.secondaryButton}
          />
        </Animated.View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      {analysisState === 'loading' ? (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingContent}>
            <TerminalSquare size={48} color={colors.primary[500]} style={styles.loadingIcon} />
            <Typography variant="h5" weight="bold" style={styles.loadingTitle}>
              Análisis de IA en progreso
            </Typography>
            <Typography variant="body2" color="secondary" style={styles.loadingText}>
              Nuestra IA está analizando tus fotos y explicación para identificar el problema y proporcionar recomendaciones de reparación.
            </Typography>
            
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    { backgroundColor: colors.primary[500] },
                    progressStyle,
                  ]}
                />
              </View>
              <Typography variant="caption" color="secondary" style={styles.progressText}>
                {progress}% Completado
              </Typography>
            </View>
            
            <View style={styles.stepsContainer}>
              <View style={[styles.step, progress >= 30 && styles.stepActive]}>
                <Clock size={20} color={progress >= 30 ? colors.primary[500] : colors.textTertiary} />
                <Typography 
                  variant="caption" 
                  color={progress >= 30 ? 'primary' : 'tertiary'}
                  style={styles.stepText}
                >
                  Procesamiento de imagen
                </Typography>
              </View>
              
              <View style={[styles.step, progress >= 60 && styles.stepActive]}>
                <TerminalSquare size={20} color={progress >= 60 ? colors.primary[500] : colors.textTertiary} />
                <Typography 
                  variant="caption"
                  color={progress >= 60 ? 'primary' : 'tertiary'}
                  style={styles.stepText}
                >
                  Análisis de patrones
                </Typography>
              </View>
              
              <View style={[styles.step, progress >= 90 && styles.stepActive]}>
                <CheckCircle2 size={20} color={progress >= 90 ? colors.primary[500] : colors.textTertiary} />
                <Typography 
                  variant="caption" 
                  color={progress >= 90 ? 'primary' : 'tertiary'}
                  style={styles.stepText}
                >
                  Generando soluciones
                </Typography>
              </View>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Typography variant="body2" color="tertiary">
              Cancelar análisis
            </Typography>
          </TouchableOpacity>
        </View>
      ) : analysisState === 'error' ? (
        <View style={styles.errorContainer}>
          <AlertTriangle size={48} color={colors.error[500]} />
          <Typography variant="h5" weight="bold" style={styles.errorTitle}>
            Análisis fallido
          </Typography>
          <Typography variant="body1" color="secondary" style={styles.errorMessage}>
            Encontramos un error al analizar tu imagen. Por favor, intenta de nuevo con una imagen más clara o desde un ángulo diferente.
          </Typography>
          <Button
            title="Intentar de nuevo"
            onPress={handleRetry}
            style={styles.retryButton}
          />
          <Button
            title="Volver"
            variant="outline"
            onPress={() => router.back()}
            style={styles.goBackButton}
          />
        </View>
      ) : (
        renderOptionScreen()
      )}
      
      {/* Modal de discusión */}
      <Modal
        visible={showDiscussionModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseDiscussion}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <Typography variant="h6" weight="bold">
                Discutir diagnóstico
              </Typography>
              <TouchableOpacity onPress={handleCloseDiscussion}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.discussionContainer}>
              <Typography variant="body2" color="secondary" style={styles.discussionInstructions}>
                Si tienes dudas sobre el diagnóstico o quieres proporcionar más información, escríbela aquí:
              </Typography>
              
              <Card style={styles.messageCard}>
                <View style={styles.messageHeader}>
                  <Typography variant="body2" weight="bold">
                    Diagnóstico de IA
                  </Typography>
                </View>
                <Typography variant="body2">
                  {analysisResult.issue}
                </Typography>
              </Card>
              
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.textInput, { backgroundColor: colors.card, color: colors.text }]}
                  placeholder="Escribe tu pregunta o comentario..."
                  placeholderTextColor={colors.textTertiary}
                  multiline
                  value={discussionText}
                  onChangeText={setDiscussionText}
                />
                <Button
                  title="Enviar"
                  size="sm"
                  onPress={handleSendDiscussion}
                  style={styles.sendButton}
                />
              </View>
              
              {aiResponse && (
                <Card style={[styles.messageCard, styles.aiMessageCard]}>
                  <View style={styles.messageHeader}>
                    <Typography variant="body2" weight="bold">
                      Respuesta de IA
                    </Typography>
                    <TouchableOpacity
                      style={styles.speakButton}
                      onPress={() => speakText(aiResponse)}
                    >
                      <Mic size={16} color={colors.primary[500]} />
                    </TouchableOpacity>
                  </View>
                  <Typography variant="body2">
                    {aiResponse}
                  </Typography>
                </Card>
              )}
            </ScrollView>
            
            <Button
              title="Cerrar"
              variant="outline"
              onPress={handleCloseDiscussion}
              style={styles.closeButton}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.lg,
  },
  loadingContent: {
    alignItems: 'center',
    width: '100%',
  },
  loadingIcon: {
    marginBottom: Layout.spacing.md,
  },
  loadingTitle: {
    marginBottom: Layout.spacing.sm,
    textAlign: 'center',
  },
  loadingText: {
    textAlign: 'center',
    marginBottom: Layout.spacing.xl,
    maxWidth: '80%',
  },
  progressContainer: {
    width: '100%',
    marginBottom: Layout.spacing.lg,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    marginBottom: Layout.spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'right',
  },
  stepsContainer: {
    width: '100%',
    marginTop: Layout.spacing.lg,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
    opacity: 0.6,
  },
  stepActive: {
    opacity: 1,
  },
  stepText: {
    marginLeft: Layout.spacing.sm,
  },
  cancelButton: {
    marginTop: Layout.spacing.xxl,
    padding: Layout.spacing.md,
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
  retryButton: {
    minWidth: 200,
    marginBottom: Layout.spacing.md,
  },
  goBackButton: {
    minWidth: 200,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xxl,
  },
  successHeader: {
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
  },
  successTitle: {
    marginTop: Layout.spacing.md,
    marginBottom: Layout.spacing.xs,
  },
  successText: {
    textAlign: 'center',
    marginBottom: Layout.spacing.sm,
  },
  discussButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Layout.spacing.md,
    padding: Layout.spacing.sm,
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.circular,
  },
  severityText: {
    marginLeft: Layout.spacing.xs,
  },
  issueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Layout.spacing.xs,
  },
  issueText: {
    flex: 1,
  },
  speakButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.light.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Layout.spacing.sm,
  },
  sectionTitle: {
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
    flex: 1,
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
  // Estilos para el modal de discusión
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Layout.spacing.lg,
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  discussionContainer: {
    flex: 1,
    marginBottom: Layout.spacing.lg,
  },
  discussionInstructions: {
    marginBottom: Layout.spacing.md,
  },
  messageCard: {
    marginBottom: Layout.spacing.md,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  aiMessageCard: {
    backgroundColor: Colors.light.primary[50],
  },
  inputContainer: {
    marginBottom: Layout.spacing.lg,
  },
  textInput: {
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    minHeight: 100,
    marginBottom: Layout.spacing.sm,
    textAlignVertical: 'top',
  },
  sendButton: {
    alignSelf: 'flex-end',
  },
  closeButton: {
    marginTop: Layout.spacing.md,
  },
  
  // Estilos para las opciones
  optionsContainer: {
    gap: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
  },
  optionCard: {
    padding: Layout.spacing.lg,
  },
  optionIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
    alignSelf: 'center',
  },
  optionTitle: {
    marginBottom: Layout.spacing.sm,
    textAlign: 'center',
  },
  optionDescription: {
    marginBottom: Layout.spacing.lg,
    textAlign: 'center',
  },
  optionButton: {
    alignSelf: 'center',
  },
  
  // Estilos para DIY
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xxl,
  },
  diyHeader: {
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
  },
  diyTitle: {
    marginTop: Layout.spacing.md,
    marginBottom: Layout.spacing.xs,
  },
  diySubtitle: {
    textAlign: 'center',
  },
  materialsCard: {
    marginBottom: Layout.spacing.lg,
  },
  materialItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
    paddingBottom: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  materialItem: {
    flexDirection: 'column',
    marginBottom: Layout.spacing.md,
    paddingBottom: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  materialInfo: {
    marginBottom: Layout.spacing.sm,
  },
  materialLinks: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: Layout.spacing.md,
  },
  materialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Layout.borderRadius.md,
  },
  materialButtonText: {
    color: 'white',
    marginLeft: 6,
  },
  tutorialsContainer: {
    marginBottom: Layout.spacing.lg,
  },
  tutorialCard: {
    marginBottom: Layout.spacing.md,
    padding: 0,
    overflow: 'hidden',
  },
  tutorialImage: {
    width: '100%',
    height: 160,
  },
  tutorialOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tutorialInfo: {
    padding: Layout.spacing.md,
  },
  tutorialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Layout.spacing.sm,
  },
  instructionsCard: {
    marginBottom: Layout.spacing.lg,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Layout.spacing.md,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: Layout.borderRadius.circular,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.sm,
    marginTop: 2,
  },
  instructionNumberText: {
    color: 'white',
    fontFamily: 'Inter-Bold',
  },
  instructionText: {
    flex: 1,
  },
  diyFooter: {
    alignItems: 'center',
    marginTop: Layout.spacing.lg,
    marginBottom: Layout.spacing.xl,
  },
  diyFooterText: {
    textAlign: 'center',
    marginBottom: Layout.spacing.md,
  },
  diyFooterButton: {
    minWidth: 200,
  },
  
  // Estilos para profesionales
  proHeader: {
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
  },
  proTitle: {
    marginTop: Layout.spacing.md,
    marginBottom: Layout.spacing.xs,
  },
  proSubtitle: {
    textAlign: 'center',
  },
  problemSummaryCard: {
    marginBottom: Layout.spacing.lg,
  },
  proCard: {
    marginBottom: Layout.spacing.md,
  },
  proCardContent: {
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
  },
  proMetaInfo: {
    flexDirection: 'row',
    marginTop: Layout.spacing.xs,
  },
  proRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  proRatingText: {
    marginLeft: 4,
  },
  proDistance: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  proDistanceText: {
    marginLeft: 4,
  },
  proCardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  proActionButton: {
    flex: 1,
    marginRight: Layout.spacing.md,
  },
  proFooter: {
    alignItems: 'center',
    marginTop: Layout.spacing.lg,
    marginBottom: Layout.spacing.xl,
  },
  proFooterText: {
    textAlign: 'center',
    marginBottom: Layout.spacing.md,
  },
  proFooterButton: {
    minWidth: 200,
  },
});