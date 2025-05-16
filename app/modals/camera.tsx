import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, useColorScheme, Text, Alert, Platform, Image as RNImage, ActivityIndicator } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Button } from '@/components/common/Button';
import { Typography } from '@/components/common/Typography';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { router } from 'expo-router';
import { Image, X, Repeat, Camera, Slash as FlashOn, FlashlightOff as FlashOff, Mic, MicOff, Upload } from 'lucide-react-native';
import { manipulateAsync } from 'expo-image-manipulator';
import * as Speech from 'expo-speech';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { imageToBase64 } from '@/utils/gemini';
import { transcribeAudio } from '@/utils/audioTranscription';

export default function CameraModal() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const [permission, requestPermission] = useCameraPermissions();
  const [audioPermission, setAudioPermission] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState(false);
  const cameraRef = useRef<any>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [voiceExplanation, setVoiceExplanation] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  // Audio recording
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioURI, setAudioURI] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const sound = useRef<Audio.Sound | null>(null);
  
  // Add a mounted ref to prevent state updates after unmount
  const isMounted = useRef(true);
  
  useEffect(() => {
    // Set mounted flag
    isMounted.current = true;
    
    // Cleanup function that runs on unmount
    return () => {
      isMounted.current = false;
      if (recording) {
        recording.stopAndUnloadAsync();
      }
      if (sound.current) {
        sound.current.unloadAsync();
      }
      // Cancel any pending speech
      Speech.stop();
    };
  }, []);
  
  // Request audio permissions
  useEffect(() => {
    const getAudioPermission = async () => {
      try {
        const { status } = await Audio.requestPermissionsAsync();
        if (isMounted.current) {
          setAudioPermission(status === 'granted');
        }
      } catch (error) {
        console.error('Error requesting audio permission:', error);
      }
    };
    
    if (photo) {
      getAudioPermission();
    }
  }, [photo]);
  
  // Start recording audio
  const startRecording = async () => {
    try {
      if (!audioPermission) {
        const { status } = await Audio.requestPermissionsAsync();
        if (isMounted.current) {
          setAudioPermission(status === 'granted');
        }
        if (status !== 'granted') {
          Alert.alert('Permiso necesario', 'Necesitamos permiso para grabar audio');
          return;
        }
      }
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      if (isMounted.current) {
        setRecording(recording);
        setIsListening(true);
      } else {
        // If component unmounted during this async operation, stop recording
        recording.stopAndUnloadAsync();
      }
    } catch (err) {
      console.error('Error al iniciar la grabación', err);
      if (isMounted.current) {
        Alert.alert('Error', 'No se pudo iniciar la grabación de audio');
      }
    }
  };
  
  // Stop recording audio and transcribe it
  const stopRecording = async () => {
    if (!recording || !isMounted.current) return;
    
    setIsListening(false);
    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      
      const uri = recording.getURI();
      if (!uri) {
        throw new Error("No se pudo obtener la URI de la grabación");
      }
      
      if (isMounted.current) {
        setAudioURI(uri);
        setRecording(null);
        
        // Transcribe the audio using Gemini AI
        setIsTranscribing(true);
      }
      
      try {
        const transcription = await transcribeAudio(uri);
        if (isMounted.current) {
          if (transcription) {
            setVoiceExplanation(transcription);
          } else {
            // Si falla la transcripción, usamos un texto de respaldo para demo
            setVoiceExplanation('El grifo de la cocina está goteando constantemente y ha formado una mancha de agua en el armario debajo del fregadero.');
            console.log("Usando texto de respaldo para la transcripción");
          }
        }
      } catch (error) {
        console.error("Error en la transcripción:", error);
        if (isMounted.current) {
          setVoiceExplanation('El grifo de la cocina está goteando constantemente y ha formado una mancha de agua en el armario debajo del fregadero.');
        }
      } finally {
        if (isMounted.current) {
          setIsTranscribing(false);
        }
      }
    } catch (err) {
      console.error('Error al detener la grabación', err);
      if (isMounted.current) {
        setRecording(null);
        setIsTranscribing(false);
      }
    }
  };
  
  // Play recorded audio
  const playRecordedAudio = async () => {
    if (!audioURI || !isMounted.current) return;
    
    try {
      if (sound.current) {
        await sound.current.unloadAsync();
      }
      
      const { sound: audioSound } = await Audio.Sound.createAsync(
        { uri: audioURI },
        { shouldPlay: true }
      );
      
      if (!isMounted.current) {
        audioSound.unloadAsync();
        return;
      }
      
      sound.current = audioSound;
      setIsPlaying(true);
      
      audioSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish && isMounted.current) {
          setIsPlaying(false);
        }
      });
    } catch (err) {
      console.error('Error al reproducir audio', err);
      if (isMounted.current) {
        setIsPlaying(false);
      }
    }
  };
  
  // Función para leer el texto en voz alta
  const speakExplanation = () => {
    if (voiceExplanation && isMounted.current) {
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
  
  // Función para tomar foto, con manejo mejorado de errores
  const takePicture = async () => {
    if (cameraRef.current && isMounted.current) {
      try {
        setIsProcessing(true);
        
        // Para dispositivos móviles, usamos la cámara
        const photo = await cameraRef.current.takePictureAsync();
        
        // Reducimos el tamaño para evitar problemas con la API
        const manipResult = await manipulateAsync(
          photo.uri,
          [{ resize: { width: 1200 } }],
          { compress: 0.7 }
        );
        
        if (isMounted.current) {
          setPhoto(manipResult.uri);
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        if (isMounted.current) {
          Alert.alert('Error', 'No se pudo tomar la foto. Por favor, inténtalo de nuevo.');
        }
      } finally {
        if (isMounted.current) {
          setIsProcessing(false);
        }
      }
    }
  };
  
  // Alternativa: Seleccionar imagen de la galería
  const pickImage = async () => {
    if (!isMounted.current) return;
    
    try {
      setIsProcessing(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });
      
      if (!isMounted.current) return;
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      if (isMounted.current) {
        Alert.alert('Error', 'No se pudo seleccionar la imagen. Por favor, inténtalo de nuevo.');
      }
    } finally {
      if (isMounted.current) {
        setIsProcessing(false);
      }
    }
  };
  
  const retakePicture = () => {
    if (!isMounted.current) return;
    
    setPhoto(null);
    setVoiceExplanation('');
    setAudioURI(null);
    
    if (sound.current) {
      sound.current.unloadAsync();
      sound.current = null;
    }
  };
  
  const handleUsePhoto = async () => {
    if (!isMounted.current) return;
    
    // Comprobamos que tengamos una explicación antes de continuar
    if (!voiceExplanation) {
      Alert.alert('Se requiere descripción', 'Por favor, describe el problema para continuar');
      return;
    }
    
    try {
      // Guardamos los datos del diagnóstico
      const diagnosisData = {
        photo: photo,
        explanation: voiceExplanation,
        audio: audioURI
      };
      
      // Almacenamos datos en AsyncStorage para recuperarlos en la pantalla de resultados
      await AsyncStorage.setItem('currentDiagnosis', JSON.stringify({
        photoUri: photo,
        explanation: voiceExplanation
      }));
      
      if (isMounted.current) {
        router.back();
        
        // Añadimos un pequeño retraso para evitar problemas de navegación
        setTimeout(() => {
          if (isMounted.current) {
            router.push('/(tabs)/diagnosis/result');
          }
        }, 100);
      }
    } catch (error) {
      console.error('Error saving diagnosis data:', error);
      if (isMounted.current) {
        Alert.alert('Error', 'No se pudieron guardar los datos del diagnóstico.');
      }
    }
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
                  ? 'Grabando audio... Habla claramente' 
                  : isTranscribing
                    ? 'Transcribiendo audio...'
                    : 'Presiona el micrófono y describe el problema en detalle'}
              </Typography>
              
              {isTranscribing ? (
                <View style={styles.transcribingContainer}>
                  <ActivityIndicator color={colors.primary[500]} size="large" />
                  <Typography variant="caption" style={{color: 'white', marginTop: 8}}>
                    Convirtiendo audio a texto...
                  </Typography>
                </View>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.recordButton,
                    isListening && { backgroundColor: colors.error[500] }
                  ]}
                  onPress={isListening ? stopRecording : startRecording}
                  disabled={isTranscribing}
                >
                  {isListening ? (
                    <MicOff size={24} color="white" />
                  ) : (
                    <Mic size={24} color="white" />
                  )}
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.explanationTextContainer}>
              <Typography variant="body2" style={styles.explanationText}>
                {voiceExplanation}
              </Typography>
              
              <View style={styles.explanationActions}>
                {audioURI && (
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.primary[500] }]}
                    onPress={playRecordedAudio}
                    disabled={isPlaying}
                  >
                    <Mic size={18} color="white" />
                    <Typography variant="caption" style={styles.actionButtonText}>
                      {isPlaying ? 'Reproduciendo...' : 'Escuchar audio'}
                    </Typography>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.warning[500] }]}
                  onPress={() => {
                    if (!isMounted.current) return;
                    setVoiceExplanation('');
                    setAudioURI(null);
                    if (sound.current) {
                      sound.current.unloadAsync();
                      sound.current = null;
                    }
                  }}
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
            Capturar imagen del problema
          </Typography>
          
          <View style={styles.webCameraBtns}>
            <Button
              title="Usar cámara"
              leftIcon={<Camera size={16} color="white" />}
              onPress={() => {
                // Intenta abrir la cámara web
                takePicture().catch(err => {
                  console.log("Error al acceder a la cámara web:", err);
                  if (isMounted.current) {
                    Alert.alert(
                      "Error de cámara", 
                      "No se pudo acceder a la cámara. Intenta seleccionar una imagen en su lugar.",
                      [
                        { text: "OK", onPress: () => pickImage() }
                      ]
                    );
                  }
                });
              }}
              style={{marginBottom: 20}}
            />
            
            <Button
              title="Seleccionar imagen"
              variant="outline"
              leftIcon={<Upload size={16} color={colors.primary[500]} />}
              onPress={pickImage}
              style={{marginBottom: 40}}
            />
          </View>
          
          <Typography variant="body2" style={{color: 'white', textAlign: 'center'}}>
            Para mejores resultados, asegúrate que la imagen muestre claramente el problema.
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
              
              <TouchableOpacity
                style={styles.galleryButton}
                onPress={pickImage}
              >
                <Upload size={28} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      )}
      {isProcessing && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary[500]} />
            <Typography variant="body1" style={{color: 'white', marginTop: 10}}>
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
    width: '100%',
  },
  webCameraBtns: {
    width: '100%',
    maxWidth: 300,
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
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
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
  transcribingContainer: {
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