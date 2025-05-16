import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, useColorScheme, Text, Alert, Platform, Image as RNImage } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Button } from '@/components/common/Button';
import { Typography } from '@/components/common/Typography';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { router } from 'expo-router';
import { Image, X, Repeat, Camera, Slash as FlashOn, FlashlightOff as FlashOff, Mic, MicOff } from 'lucide-react-native';
import { manipulateAsync } from 'expo-image-manipulator';
import * as Speech from 'expo-speech';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { imageToBase64 } from '@/utils/gemini';

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
  const [isProcessing, setIsProcessing] = useState(false);
  
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
  
  // Función modificada para tomar foto, con manejo mejorado de errores
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        setIsProcessing(true);
        
        // Si estamos en web, usamos ImagePicker como alternativa
        if (Platform.OS === 'web') {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
            allowsMultipleSelection: false,
          });
          
          if (!result.canceled && result.assets && result.assets.length > 0) {
            setPhoto(result.assets[0].uri);
          }
          setIsProcessing(false);
          return;
        }
        
        // Para dispositivos móviles, usamos la cámara
        const photo = await cameraRef.current.takePictureAsync();
        
        // Evitamos manipulación para simplificar y evitar errores
        setPhoto(photo.uri);
        
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'No se pudo tomar la foto. Por favor, inténtalo de nuevo.\n\nSugerencia: Si estás en web, permite el acceso a la cámara en la configuración del navegador o usa la opción "Subir" en lugar de "Cámara".');
      } finally {
        setIsProcessing(false);
      }
    }
  };
  
  // Alternativa: Seleccionar imagen de la galería
  const pickImage = async () => {
    try {
      setIsProcessing(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen. Por favor, inténtalo de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const retakePicture = () => {
    setPhoto(null);
    setVoiceExplanation('');
  };
  
  const handleUsePhoto = () => {
    // Aquí normalmente guardaríamos la foto y la explicación por voz para el análisis de IA
    // Por ahora, simplemente vamos a la pantalla de resultados
    router.back();
    
    // Añadimos un pequeño retraso para evitar problemas de navegación
    setTimeout(() => {
      router.push('/(tabs)/diagnosis/result');
    }, 100);
  };
  
  const handleCancel = () => {
    router.back();
  };

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
              alt="Preview" 
            />
          </View>
        ) : (
          <View style={styles.previewContainer}>
            <RNImage 
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
            title={voiceExplanation ? "Usar foto y explicación" : "Usar foto"}
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
      {Platform.OS === 'web' ? (
        <View style={styles.webCameraContainer}>
          <Typography variant="h6" weight="bold" style={{color: 'white', marginBottom: 20}}>
            Selecciona una imagen
          </Typography>
          <Button
            title="Seleccionar imagen"
            onPress={pickImage}
            style={{marginBottom: 20}}
          />
          <Typography variant="body2" style={{color: 'white', textAlign: 'center'}}>
            La captura de cámara en web puede presentar limitaciones.
            Te recomendamos seleccionar una imagen existente.
          </Typography>
        </View>
      ) : (
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
                disabled={isProcessing}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
              
              <View style={styles.placeholderButton} />
            </View>
          </View>
        </CameraView>
      )}
      {isProcessing && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <Typography variant="body1" style={{color: 'white', marginBottom: 10}}>
              Procesando imagen...
            </Typography>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webCameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContainer: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
  },
});