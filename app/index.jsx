import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

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
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      Alert.alert('Éxito', `Bienvenido ${user.username}`);
      router.replace('/auth'); 
      console.log(`${user.username} no se quiere ir al login`);
    } else {
      Alert.alert('Error', 'Credenciales incorrectas');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
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

      <Text style={styles.toggle} onPress={() => setIsLogin(!isLogin)}>
        {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  toggle: { color: 'blue', marginTop: 20, textAlign: 'center' },
});
