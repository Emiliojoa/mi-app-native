import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text className="text-red-700 text-3xl font-bold">Esta ruta no existe.</Text>
        <Link href="/auth" style={styles.link}>
          <Text className="border-2 p-2 m-2 rounded-xl font-bold ">vuelve al inicio!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 600,
    
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
