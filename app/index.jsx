import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFacialAuth } from '../contexts/FacialAuthContext';

export default function AuthScreen() {
  const router = useRouter();
  const { canUseFacialAuth, isFacialRegistered } = useFacialAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [authMethod, setAuthMethod] = useState(null); // null, 'facial', 'cuenta'

  useEffect(() => {
    (async () => {
      const auth = await AsyncStorage.getItem('authenticated');
      if (auth === 'true') {
        setIsAuthenticated(true);
        router.replace('/auth');
      }
      if (!permission?.granted) {
        await requestPermission();
      }
    })();
  }, []);

  const handleLoginWithPhoto = async () => {
    if (photo) {
      await AsyncStorage.setItem('authenticated', 'true');
      setIsAuthenticated(true);
      Alert.alert('Éxito', 'Autenticado con foto');
      router.replace('/auth');
    } else {
      Alert.alert('Error', 'Toma una foto para autenticarte');
    }
  };

  const tomarFoto = async () => {
    if (cameraRef.current) {
      const foto = await cameraRef.current.takePictureAsync();
      setPhoto(foto.uri);
    }
  };

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Solicitando permisos de cámara...</Text>
      </View>
    );
  }
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>No se tiene acceso a la cámara.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Permitir cámara</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Pantalla de selección de método de autenticación
  if (!authMethod) {
    return (
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
        }}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.welcomeContainer}>
            <Ionicons name="shield-checkmark" size={60} color="#007bff" />
            <Text style={styles.welcomeTitle}>Bienvenido</Text>
            <Text style={styles.welcomeSubtitle}>Elige tu método de acceso</Text>
          </View>

          <View style={styles.authOptionsContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => setAuthMethod('cuenta')}>
              <Ionicons name="person" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>Iniciar Sesión Clásica</Text>
            </TouchableOpacity>

            {canUseFacialAuth() ? (
              <TouchableOpacity style={styles.facialButton} onPress={() => router.push('/facial-login')}>
                <Ionicons name="scan" size={20} color="#fff" />
                <Text style={styles.facialButtonText}>Ingresar con Rostro</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/facial-register')}>
                <Ionicons name="person-add" size={20} color="#007bff" />
                <Text style={styles.secondaryButtonText}>Registrar Rostro</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.button} onPress={() => setAuthMethod('facial')}>
              <Ionicons name="camera" size={20} color="#fff" />
              <Text style={styles.buttonText}>Demo Cámara (Original)</Text>
            </TouchableOpacity>
          </View>

          {isFacialRegistered && (
            <View style={styles.statusContainer}>
              <Ionicons name="checkmark-circle" size={16} color="#28a745" />
              <Text style={styles.statusText}>Reconocimiento facial activo</Text>
            </View>
          )}
        </View>
      </ImageBackground>
    );
  }

  // Aquí iría tu formulario tradicional de login
  if (authMethod === 'cuenta') {
    return (
      <TouchableOpacity onPress={() => router.push("/")}>
        <View style={styles.center}>
          <Text style={styles.title}>Login tradicional</Text>
          {/* Aquí puedes poner tu formulario de usuario y contraseña */}
          <TouchableOpacity style={styles.button} onPress={() => setAuthMethod(null)}>
            <Text style={styles.buttonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  // Autenticación facial


  // Autenticación facial
  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
      }}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Autenticación con Cámara</Text>
        {!photo ? (
          <>
            <CameraView
              style={styles.camera}
              ref={cameraRef}
              facing="front"
            />
            <TouchableOpacity style={styles.button} onPress={tomarFoto}>
              <Text style={styles.buttonText}>Tomar Foto para Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setAuthMethod(null)}>
              <Text style={styles.buttonText}>Volver</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Image source={{ uri: photo }} style={styles.preview} />
            <TouchableOpacity style={styles.button} onPress={handleLoginWithPhoto}>
              <Text style={styles.buttonText}>Ingresar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setPhoto(null)}>
              <Text style={styles.buttonText}>Reintentar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setAuthMethod(null)}>
              <Text style={styles.buttonText}>Volver</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
  authOptionsContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  primaryButton: {
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  facialButton: {
    backgroundColor: '#28a745',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  facialButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#007bff',
  },
  secondaryButtonText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(40,167,69,0.8)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#fff' },
  camera: { width: 300, height: 400, borderRadius: 10 },
  button: {
    marginTop: 15,
    backgroundColor: '#6c757d',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  preview: { width: 300, height: 400, borderRadius: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
