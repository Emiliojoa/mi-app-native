import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFacialAuth } from '../contexts/FacialAuthContext';

const FacialLoginScreen = () => {
  const router = useRouter();
  const { loginWithFace, loading, canUseFacialAuth } = useFacialAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  // Validar permisos de cámara
  if (!permission) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Solicitando permisos de cámara...</Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={60} color="#ccc" />
          <Text style={styles.permissionTitle}>Permisos de Cámara Requeridos</Text>
          <Text style={styles.permissionText}>
            Para el reconocimiento facial necesitamos acceso a la cámara
          </Text>
          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Otorgar Permisos</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]} 
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Verificar si el usuario puede usar reconocimiento facial
  if (!canUseFacialAuth()) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={60} color="#f0ad4e" />
          <Text style={styles.errorTitle}>Reconocimiento Facial No Disponible</Text>
          <Text style={styles.errorText}>
            Debes registrar tu rostro primero antes de poder usar esta función.
          </Text>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push('/facial-register')}
          >
            <Ionicons name="person-add" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Registrar Rostro</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Tomar foto para reconocimiento
  const takePicture = async () => {
    if (cameraRef.current && !isProcessing) {
      try {
        setIsProcessing(true);
        
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });

        console.log('Foto capturada, iniciando reconocimiento...');

        // Intentar reconocimiento facial
        const result = await loginWithFace(photo.uri);
        
        console.log('Resultado del reconocimiento:', result);

        // Si el reconocimiento es exitoso, marcar como autenticado y redirigir
        await AsyncStorage.setItem('authenticated', 'true');
        
        Alert.alert(
          'Acceso Concedido',
          'Reconocimiento facial exitoso. Bienvenido!',
          [
            {
              text: 'Continuar',
              onPress: () => router.replace('/auth'),
            },
          ]
        );

      } catch (error) {
        console.error('Error en reconocimiento facial:', error);
        
        Alert.alert(
          'Reconocimiento Fallido',
          'No se pudo reconocer tu rostro. ' + error.message,
          [
            { text: 'Intentar de nuevo', style: 'default' },
            { text: 'Cancelar', onPress: () => router.back(), style: 'cancel' },
          ]
        );
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Renderizar instrucciones iniciales
  if (showInstructions) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.instructionsContainer}>
          <Ionicons name="face-recognition" size={80} color="#007bff" />
          <Text style={styles.instructionsTitle}>Reconocimiento Facial</Text>
          <Text style={styles.instructionsText}>
            Vamos a verificar tu identidad usando tu rostro registrado.
          </Text>
          
          <View style={styles.stepsList}>
            <View style={styles.step}>
              <Ionicons name="camera-outline" size={24} color="#28a745" />
              <Text style={styles.stepText}>Centra tu rostro en la cámara</Text>
            </View>
            <View style={styles.step}>
              <Ionicons name="sunny-outline" size={24} color="#28a745" />
              <Text style={styles.stepText}>Asegúrate de tener buena iluminación</Text>
            </View>
            <View style={styles.step}>
              <Ionicons name="checkmark-circle-outline" size={24} color="#28a745" />
              <Text style={styles.stepText}>Mantente inmóvil al tomar la foto</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => setShowInstructions(false)}
          >
            <Ionicons name="camera" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Iniciar Reconocimiento</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Renderizar cámara para reconocimiento
  return (
    <View style={styles.cameraContainer}>
      <View style={styles.cameraHeader}>
        <TouchableOpacity 
          style={styles.cameraBackButton}
          onPress={() => setShowInstructions(true)}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
          <Text style={styles.cameraBackButtonText}>Volver</Text>
        </TouchableOpacity>
        <Text style={styles.cameraTitle}>Reconocimiento Facial</Text>
        <View style={{ width: 80 }} />
      </View>

      <CameraView
        style={styles.camera}
        ref={cameraRef}
        facing="front"
      />

      <View style={styles.cameraOverlay}>
        <View style={styles.faceFrame}>
          {isProcessing || loading ? (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="large" color="#00ff00" />
              <Text style={styles.processingText}>
                {isProcessing ? 'Procesando...' : 'Verificando identidad...'}
              </Text>
            </View>
          ) : (
            <Text style={styles.instructionText}>
              Centra tu rostro en el marco y toca para capturar
            </Text>
          )}
        </View>
      </View>

      <View style={styles.cameraControls}>
        <TouchableOpacity 
          style={[styles.captureButton, (isProcessing || loading) && styles.disabledButton]}
          onPress={takePicture}
          disabled={isProcessing || loading}
        >
          {isProcessing || loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Ionicons name="scan" size={30} color="#fff" />
          )}
        </TouchableOpacity>
        
        <Text style={styles.captureButtonText}>
          {isProcessing || loading ? 'Procesando...' : 'Tocar para reconocer'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 15,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  instructionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  instructionsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 15,
  },
  instructionsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  stepsList: {
    width: '100%',
    marginBottom: 40,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  stepText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    flex: 1,
  },
  primaryButton: {
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    marginBottom: 15,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  // Estilos de cámara
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  cameraBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cameraBackButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  cameraTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    position: 'absolute',
    top: 150,
    left: 0,
    right: 0,
    bottom: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceFrame: {
    width: 280,
    height: 350,
    borderWidth: 2,
    borderColor: '#00ff00',
    borderRadius: 140,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    maxWidth: 250,
  },
  processingContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
  },
  processingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: '#666',
  },
  captureButtonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default FacialLoginScreen;
