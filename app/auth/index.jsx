import { router } from 'expo-router';
import { Button, ScrollView, StyleSheet, Text } from 'react-native';


export default function HomePage() {
  return (
    
    <ScrollView style={{ flex: 1, padding: 20 }} contentContainerStyle={styles.container}>
      <Text className="">🏠 Pantalla principal tras el login</Text>
      <Text className="text-lg mt-4">¡Bienvenido a la aplicación!</Text>
      <Text className="text-lg mt-2">Aquí puedes navegar a las publicaciones y comentarios.</Text>
      <Text className="text-lg mt-2">Utiliza la barra de navegación para explorar las diferentes secciones.</Text>
      <Text className="text-lg mt-2">¡Disfruta de la experiencia!</Text>  
      <Button 
      title="Publicaciones" 
       onPress={() => 
       router.push('/publicaciones')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: { fontSize: 24 },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    alignItems: 'center',
  },
});
