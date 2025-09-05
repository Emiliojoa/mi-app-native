import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFacialAuth } from '../contexts/FacialAuthContext';
import { formatCuil, validateCuil } from '../services/FacialRecognitionAPI';

const FacialRegisterScreen = () => {
  const router = useRouter();
  const { registerFacialAuth, loading } = useFacialAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  // Estados para el formulario
  const [cuil, setCuil] = useState('');
  const [photo, setPhoto] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Validar permisos de cámara
  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Solicitando permisos de cámara...</Text>
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
            Para registrar tu rostro necesitamos acceso a la cámara
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

  // Manejar cambio de CUIL con formato automático
  const handleCuilChange = (text) => {
    // Remover caracteres no numéricos
    const numericText = text.replace(/[^0-9]/g, '');
    
    // Limitar a 11 dígitos
    if (numericText.length <= 11) {
      setCuil(numericText);
    }
  };

  // Tomar foto
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        setIsProcessing(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        setPhoto(photo.uri);
        setShowCamera(false);
      } catch (error) {
        Alert.alert('Error', 'No se pudo tomar la foto');
        console.error('Error tomando foto:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Reiniciar foto
  const retakePicture = () => {
    setPhoto(null);
    setShowCamera(true);
  };

  // Validar formulario
  const validateForm = () => {
    if (!cuil.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu CUIL');
      return false;
    }

    if (!validateCuil(cuil)) {
      Alert.alert('Error', 'El CUIL debe tener 11 dígitos');
      return false;
    }

    if (!photo) {
      Alert.alert('Error', 'Por favor toma una foto');
      return false;
    }

    return true;
  };

  // Manejar registro
  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      const cleanCuil = cuil.replace(/[-\s]/g, '');
      await registerFacialAuth(cleanCuil, photo);
      
      Alert.alert(
        'Registro Exitoso',
        'Tu rostro ha sido registrado correctamente. Ahora puedes usar reconocimiento facial para iniciar sesión.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error en el Registro', error.message);
    }
  };

  // Renderizar cámara
  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <View style={styles.cameraHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setShowCamera(false)}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
          <Text style={styles.cameraTitle}>Capturar Rostro</Text>
          <View style={{ width: 80 }} />
        </View>

        <CameraView
          style={styles.camera}
          ref={cameraRef}
          facing="front"
        />

        <View style={styles.cameraOverlay}>
          <View style={styles.faceFrame}>
            <Text style={styles.instructionText}>
              Centra tu rostro en el marco
            </Text>
          </View>
        </View>

        <View style={styles.cameraControls}>
          <TouchableOpacity 
            style={styles.captureButton}
            onPress={takePicture}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <Ionicons name="camera" size={30} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerBackButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registro Facial</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoContainer}>
          <Ionicons name="shield-checkmark" size={60} color="#007bff" />
          <Text style={styles.infoTitle}>Registra tu Rostro</Text>
          <Text style={styles.infoText}>
            Tu rostro será utilizado para acceder de forma segura a tu cuenta.
            Los datos se almacenan de forma encriptada.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>CUIL *</Text>
            <TextInput
              style={styles.input}
              value={formatCuil(cuil)}
              onChangeText={handleCuilChange}
              placeholder="XX-XXXXXXXX-X"
              keyboardType="numeric"
              maxLength={13} // 11 dígitos + 2 guiones
            />
            <Text style={styles.inputHelper}>
              Ingresa tu CUIL de 11 dígitos
            </Text>
          </View>

          <View style={styles.photoContainer}>
            <Text style={styles.inputLabel}>Foto de Rostro *</Text>
            
            {photo ? (
              <View style={styles.photoPreview}>
                <Image source={{ uri: photo }} style={styles.previewImage} />
                <TouchableOpacity 
                  style={styles.retakeButton}
                  onPress={retakePicture}
                >
                  <Ionicons name="camera-reverse" size={20} color="#007bff" />
                  <Text style={styles.retakeButtonText}>Tomar otra foto</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.photoButton}
                onPress={() => setShowCamera(true)}
              >
                <Ionicons name="camera" size={40} color="#007bff" />
                <Text style={styles.photoButtonText}>Tomar Foto</Text>
                <Text style={styles.photoButtonSubtext}>
                  Usa la cámara frontal para capturar tu rostro
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.registerButton, (!cuil || !photo) && styles.disabledButton]}
          onPress={handleRegister}
          disabled={loading || !cuil || !photo}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.registerButtonText}>Registrar Rostro</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]}
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerBackButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  infoContainer: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 30,
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputHelper: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  photoContainer: {
    marginBottom: 25,
  },
  photoButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#007bff',
    borderStyle: 'dashed',
    borderRadius: 10,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007bff',
    marginTop: 10,
  },
  photoButtonSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  photoPreview: {
    alignItems: 'center',
  },
  previewImage: {
    width: 200,
    height: 250,
    borderRadius: 10,
    marginBottom: 15,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  retakeButtonText: {
    fontSize: 16,
    color: '#007bff',
    marginLeft: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  registerButton: {
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  button: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
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
    bottom: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceFrame: {
    width: 250,
    height: 300,
    borderWidth: 2,
    borderColor: '#00ff00',
    borderRadius: 125,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
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
  },
  // Permisos
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
  message: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
});

export default FacialRegisterScreen;
