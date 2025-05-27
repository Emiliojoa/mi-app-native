import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ScrollScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Revisión</Text>
        <Text style={styles.subtitle}>Scroll through the content</Text>
      </View>
      
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
        <View key={item} style={styles.card}>
          <Text style={styles.cardTitle}>Item {item}</Text>
          <Text style={styles.cardDescription}>
            This is a scrollable content item that demonstrates the scroll functionality
            in this tab. You can add more content here.
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});