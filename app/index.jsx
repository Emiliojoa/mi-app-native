import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AuthScreen() {
  const router = useRouter();
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
      <View style={styles.center}>
        <Text style={styles.title}>¿Cómo quieres iniciar sesión?</Text>
        <TouchableOpacity style={styles.button} onPress={() => setAuthMethod('cuenta')}>
          <Text style={styles.buttonText}>Iniciar sesión con cuenta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setAuthMethod('facial')}>
          <Text style={styles.buttonText}>Iniciar sesión con datos faciales</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Aquí iría tu formulario tradicional de login
  if (authMethod === 'cuenta') {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Login tradicional</Text>
        {/* Aquí puedes poner tu formulario de usuario y contraseña */}
        <TouchableOpacity style={styles.button} onPress={() => setAuthMethod(null)}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,200,0.6)',
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  camera: { width: 300, height: 400, borderRadius: 10 },
  button: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  preview: { width: 300, height: 400, borderRadius: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
