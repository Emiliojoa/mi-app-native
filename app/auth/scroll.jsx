import { ScrollView, StyleSheet, Text } from 'react-native';

export default function PantallaConScroll() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.text}>¡Hola!</Text>
      {/* Podés agregar muchos elementos para probar el scroll */}
      {Array.from({ length: 30 }).map((_, i) => (
        <Text key={i} style={styles.text}>Elemento {i + 1}</Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginVertical: 10,
  },
});
