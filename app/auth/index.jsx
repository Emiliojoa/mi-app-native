import { ScrollView, StyleSheet, Text } from 'react-native';


export default function HomePage() {
  return (
    <ScrollView style={{ flex: 1, padding: 20 }} contentContainerStyle={styles.container}>
      <Text className>🏠 Pantalla principal tras el login</Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: { fontSize: 24 }
});
