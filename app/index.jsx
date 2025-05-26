import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, ImageBackground, Text, TextInput, View } from 'react-native';

export default function AuthScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    const exists = users.find(u => u.username === username);
    if (exists) {
      Alert.alert('Error', 'El usuario ya existe');
      return;
    }
    const newUser = { username, password };
    setUsers([...users, newUser]);
    Alert.alert('Registrado', 'Usuario registrado con éxito');
    setUsername('');
    setPassword('');
    setIsLogin(true);
  };

  const handleLogin = () => {
    const user = users.find(u => u.username === username && u.password === password)
    if (user) {
      Alert.alert('Éxito', `Bienvenido ${user.username}`);
      router.replace('/auth');
      console.log(`${user.username} no se quiere ir al login`);
    } else {
      Alert.alert('Error', 'Credenciales incorrectas');
    }
  };

  return (
    <ImageBackground
      source={{ uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80" }}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View className="flex-1 justify-center items-center bg-yellow-100/60">
        <Text className="p-4 font-bold">{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</Text>
        <TextInput
          className="border border-black p-2 rounded mb-2 h-10 w-60 font-bold"
          placeholder="Usuario"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          className="border-2 border-black p-2 rounded mb-2 h-10 w-60 font-bold"
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {isLogin ? (
          <Button title="Ingresar" onPress={handleLogin} />
        ) : (
          <Button title="Registrar" onPress={handleRegister} />
        )}
        <Text className="p-4 font-bold" onPress={() => setIsLogin(!isLogin)}>
          {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </Text>
      </View>
    </ImageBackground>
  );
}
