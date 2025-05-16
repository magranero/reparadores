import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, useColorScheme, Text, Alert, Platform, ActivityIndicator } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Button } from '@/components/common/Button';
import { Typography } from '@/components/common/Typography';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { router } from 'expo-router';
import { Image, X, Repeat, Camera, Slash as FlashOn, FlashlightOff as FlashOff, Mic, MicOff } from 'lucide-react-native';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as Speech from 'expo-speech';
import { analyzeImageAndDescription } from '@/utils/geminiAI';
import { TextInput } from 'react-native';

export default function CameraModal() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState(false);
  const cameraRef = useRef<any>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceExplanation, setVoiceExplanation] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDiscussionModal, setShowDiscussionModal] = useState(false);
  const [discussionText, setDiscussionText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<{ role: 'user' | 'model', content: string }[]>([]);
  
  // Simulación de reconocimiento de voz (en una app real usaríamos Speech Recognition)
  const startListening = () => {
    setIsListening(true);
    // Simulamos que estamos escuchando
    setTimeout(() => {
      setIsListening(false);
      setVoiceExplanation('El grifo de la cocina está goteando constantemente y ha formado una mancha de agua en el armario debajo del fregadero.');
    }, 3000);
  };
  
  const stopListening = () => {
    setIsListening(false);
  };
  
  // Función para leer el texto en voz alta
  const speakExplanation = () => {
    if (voiceExplanation) {
      Speech.speak(voiceExplanation, {
        language: 'es',
        pitch: 1.0,
        rate: 0.9,
      });
    }
  };
  
  if (!permission) {
    // Camera permissions are still loading
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Typography variant="body1">Cargando permisos...</Typography>
      </View>
    );
  }
  
  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Typography variant="h5" weight="bold" style={styles.permissionTitle}>
          Necesitamos tu permiso
        </Typography>
        <Typography variant="body1" color="secondary" style={styles.permissionText}>
          Por favor, concede acceso a la cámara para diagnosticar problemas del hogar con fotos.
        </Typography>
        <Button 
          title="Conceder Permiso" 
          onPress={requestPermission}
          style={styles.permissionButton}
        />
        <Button
          title="Cancelar"
          variant="outline"
          onPress={() => router.back()}
          style={styles.cancelButton}
        />
      </View>
    );
  }
  
  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };
  
  const toggleFlash = () => {
    setFlash(current => !current);
  };
  
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        
        // Resize image to reduce file size
        const manipResult = await manipulateAsync(
          photo.uri,
          [{ resize: { width: 1200 } }],
          { compress: 0.7, format: SaveFormat.JPEG }
        );
        
        setPhoto(manipResult.uri);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'No se pudo tomar la foto. Por favor, inténtalo de nuevo.');
      }
    }
  };
  
  const retakePicture = () => {
    setPhoto(null);
    setVoiceExplanation('');
  };
  
  const handleUsePhoto = async () => {
    if (!photo || !voiceExplanation) {
      Alert.alert('Información incompleta', 'Por favor, proporciona una foto y una explicación del problema.');
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Convertir la imagen a base64
      const response = await fetch(photo);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const base64data = reader.result?.toString().split(',')[1] || '';
            
            // Analizar la imagen y descripción con Gemini AI
            const analysisResult = await analyzeImageAndDescription(base64data, voiceExplanation);
            
            // Guardar el resultado en el almacenamiento global o pasarlo como parámetro
            // En una implementación real, guardaríamos esto en un estado global o base de datos
            
            // Inicializar el historial de conversación
            const initialHistory = [
              { 
                role: 'user', 
                content: `Foto: [IMAGEN] - Descripción: ${voiceExplanation}` 
              },
              { 
                role: 'model', 
                content: `He analizado tu problema y parece ser: ${analysisResult.issue}. La severidad es ${analysisResult.severity}. ¿Hay algo más que quieras saber sobre este diagnóstico?` 
              }
            ];
            
            setConversationHistory(initialHistory);
            
            // Mostrar el modal de discusión
            setShowDiscussionModal(true);
            setIsAnalyzing(false);
            
            // Aquí normalmente pasaríamos a la pantalla de resultados con los datos
            // router.push({
            //   pathname: '/(tabs)/diagnosis/result',
            //   params: { analysisResult: JSON.stringify(analysisResult) }
            // });
            
            resolve(true);
          } catch (error) {
            console.error('Error al procesar la imagen:', error);
            Alert.alert('Error', 'Hubo un problema al analizar la imagen. Por favor, inténtalo de nuevo.');
            setIsAnalyzing(false);
            reject(error);
          }
        };
        reader.onerror = (error) => {
          console.error('Error al leer la imagen:', error);
          Alert.alert('Error', 'No se pudo procesar la imagen. Por favor, inténtalo de nuevo.');
          setIsAnalyzing(false);
          reject(error);
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error al preparar la imagen:', error);
      Alert.alert('Error', 'No se pudo preparar la imagen para el análisis. Por favor, inténtalo de nuevo.');
      setIsAnalyzing(false);
    }
  };
  
  const handleSendDiscussion = async () => {
    if (discussionText.trim() === '') return;
    
    // Agregar el mensaje del usuario al historial
    const updatedHistory = [
      ...conversationHistory,
      { role: 'user', content: discussionText }
    ];
    setConversationHistory(updatedHistory);
    
    // Limpiar el campo de texto
    setDiscussionText('');
    
    // Mostrar que la IA está respondiendo
    setIsAiResponding(true);
    
    try {
      // Obtener respuesta de la IA
      const response = await discussDiagnosis(updatedHistory, discussionText);
      
      // Agregar la respuesta de la IA al historial
      const finalHistory = [
        ...updatedHistory,
        { role: 'model', content: response }
      ];
      setConversationHistory(finalHistory);
      
      // Actualizar la respuesta de la IA
      setAiResponse(response);
    } catch (error) {
      console.error('Error al obtener respuesta de la IA:', error);
      Alert.alert('Error', 'No se pudo obtener una respuesta. Por favor, inténtalo de nuevo.');
    } finally {
      setIsAiResponding(false);
    }
  };
  
  // Función simulada para discutir el diagnóstico (en una implementación real, usaríamos la API de Gemini)
  const discussDiagnosis = async (history: { role: 'user' | 'model', content: string }[], message: string) => {
    // Simulamos una respuesta de la IA
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve('Entiendo tu preocupación. Basado en la imagen y tu descripción, sigo considerando que el problema es con el sifón, pero también revisaré si hay problemas adicionales en las conexiones de suministro de agua. ¿Hay algún otro detalle que quieras compartir?');
      }, 1500);
    });
  };
  
  const handleCancel = () => {
    router.back();
  };
  
  const handleFinishDiscussion = () => {
    // Cerrar el modal de discusión y pasar a la pantalla de resultados
    setShowDiscussionModal(false);
    router.back();
    
    // Pasamos a la pantalla de resultados con los datos
    router.push('/(tabs)/diagnosis/result');
  };

  if (isAnalyzing) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Typography variant="h5" weight="bold" style={{ marginTop: 20, marginBottom: 10 }}>
          Analizando imagen
        </Typography>
        <Typography variant="body1" color="secondary" style={{ textAlign: 'center', maxWidth: '80%' }}>
          Nuestra IA está analizando tu foto y descripción para identificar el problema...
        </Typography>
      </View>
    );
  }

  if (showDiscussionModal) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.modalHeader}>
          <Typography variant="h6" weight="bold">
            Discutir diagnóstico
          </Typography>
          <TouchableOpacity onPress={handleFinishDiscussion}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.discussionContainer}>
          <Typography variant="body2" color="secondary" style={styles.discussionInstructions}>
            Si tienes dudas sobre el diagnóstico o quieres proporcionar más información, escríbela aquí:
          </Typography>
          
          {conversationHistory.map((message, index) => (
            <View 
              key={index} 
              style={[
                styles.messageCard,
                message.role === 'model' ? styles.aiMessageCard : styles.userMessageCard,
                { backgroundColor: message.role === 'model' ? colors.primary[50] : colors.card }
              ]}
            >
              <View style={styles.messageHeader}>
                <Typography variant="body2" weight="bold">
                  {message.role === 'model' ? 'Diagnóstico de IA' : 'Tú'}
                </Typography>
                {message.role === 'model' && (
                  <TouchableOpacity
                    style={styles.speakButton}
                    onPress={() => Speech.speak(message.content, { language: 'es' })}
                  >
                    <Mic size={16} color={colors.primary[500]} />
                  </TouchableOpacity>
                )}
              </View>
              <Typography variant="body2">
                {message.content}
              </Typography>
            </View>
          ))}
        </View>
        
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
            loading={isAiResponding}
            disabled={isAiResponding || discussionText.trim() === ''}
          />
        </View>
        
        <Button
          title="Finalizar y ver resultados"
          variant="outline"
          onPress={handleFinishDiscussion}
          style={styles.closeButton}
        />
      </View>
    );
  }

  if (photo) {
    return (
      <View style={[styles.container, { backgroundColor: 'black' }]}>
        {Platform.OS === 'web' ? (
          <View style={styles.previewContainer}>
            <img 
              src={photo} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain' 
              }} 
            />
          </View>
        ) : (
          <View style={styles.previewContainer}>
            <Image 
              source={{ uri: photo }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
          </View>
        )}
        
        <View style={styles.voiceExplanationContainer}>
          <Typography variant="h6" weight="bold" style={styles.explanationTitle}>
            Explica el problema
          </Typography>
          
          {!voiceExplanation ? (
            <View style={styles.recordContainer}>
              <Typography variant="body2" color="secondary" style={styles.recordInstructions}>
                {isListening 
                  ? 'Escuchando... Habla claramente' 
                  : 'Presiona el micrófono y describe el problema en detalle'}
              </Typography>
              
              <TouchableOpacity
                style={[
                  styles.recordButton,
                  isListening && { backgroundColor: colors.error[500] }
                ]}
                onPress={isListening ? stopListening : startListening}
              >
                {isListening ? (
                  <MicOff size={24} color="white" />
                ) : (
                  <Mic size={24} color="white" />
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.explanationTextContainer}>
              <Typography variant="body2" style={styles.explanationText}>
                {voiceExplanation}
              </Typography>
              
              <View style={styles.explanationActions}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.primary[500] }]}
                  onPress={speakExplanation}
                >
                  <Mic size={18} color="white" />
                  <Typography variant="caption" style={styles.actionButtonText}>
                    Escuchar
                  </Typography>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.warning[500] }]}
                  onPress={() => setVoiceExplanation('')}
                >
                  <X size={18} color="white" />
                  <Typography variant="caption" style={styles.actionButtonText}>
                    Borrar
                  </Typography>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        
        <View style={styles.previewControls}>
          <Button
            title="Volver a tomar"
            variant="outline"
            onPress={retakePicture}
            style={[styles.previewButton, { borderColor: 'white' }]}
          />
          <Button
            title={voiceExplanation ? "Analizar foto" : "Usar foto"}
            onPress={handleUsePhoto}
            style={styles.previewButton}
            disabled={!voiceExplanation}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: 'black' }]}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash ? 'on' : 'off'}
      >
        <View style={styles.topControls}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCancel}
          >
            <X size={24} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.flashButton}
            onPress={toggleFlash}
          >
            {flash ? (
              <FlashOn size={24} color="white" />
            ) : (
              <FlashOff size={24} color="white" />
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.captureContainer}>
          <View style={styles.captureHint}>
            <Typography variant="body2" style={styles.hintText}>
              Apunta al área con el problema
            </Typography>
          </View>
          
          <View style={styles.captureControls}>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={toggleCameraFacing}
            >
              <Repeat size={28} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
            
            <View style={styles.placeholderButton} />
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionTitle: {
    marginBottom: Layout.spacing.md,
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: Layout.spacing.xl,
    maxWidth: '80%',
  },
  permissionButton: {
    marginBottom: Layout.spacing.md,
    minWidth: 200,
  },
  cancelButton: {
    minWidth: 200,
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Layout.spacing.lg,
    marginTop: Platform.OS === 'ios' ? 40 : 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: Layout.spacing.lg,
  },
  captureHint: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.xl,
    alignSelf: 'center',
  },
  hintText: {
    color: 'white',
    textAlign: 'center',
  },
  captureControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  placeholderButton: {
    width: 50,
    height: 50,
  },
  previewContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: 'black',
  },
  voiceExplanationContainer: {
    backgroundColor: '#1E1E1E',
    width: '100%',
    padding: Layout.spacing.lg,
  },
  explanationTitle: {
    color: 'white',
    marginBottom: Layout.spacing.md,
    textAlign: 'center',
  },
  recordContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Layout.spacing.md,
  },
  recordInstructions: {
    color: 'white',
    textAlign: 'center',
    marginBottom: Layout.spacing.md,
  },
  recordButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Layout.spacing.md,
  },
  explanationTextContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    marginVertical: Layout.spacing.sm,
  },
  explanationText: {
    color: 'white',
    marginBottom: Layout.spacing.md,
  },
  explanationActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Layout.spacing.xs,
    paddingHorizontal: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
  },
  actionButtonText: {
    color: 'white',
    marginLeft: Layout.spacing.xs,
  },
  previewControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: Layout.spacing.lg,
    backgroundColor: 'black',
  },
  previewButton: {
    flex: 1,
    marginHorizontal: Layout.spacing.sm,
  },
  // Estilos para el modal de discusión
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Layout.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    width: '100%',
  },
  discussionContainer: {
    flex: 1,
    padding: Layout.spacing.lg,
    width: '100%',
  },
  discussionInstructions: {
    marginBottom: Layout.spacing.md,
  },
  messageCard: {
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.md,
  },
  userMessageCard: {
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  aiMessageCard: {
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  inputContainer: {
    padding: Layout.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    width: '100%',
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
    margin: Layout.spacing.lg,
    marginTop: 0,
  },
  speakButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});