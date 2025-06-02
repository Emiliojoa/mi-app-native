import { comentarios } from '@/constants/data';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function PublicacionDetalle() {
  const { idPublicacion } = useLocalSearchParams();
  const publicacion = comentarios.find((p) => p.id === idPublicacion);

  if (!publicacion) {
    return (
      <>
        <Stack.Screen options={{ title: 'Publicación no encontrada' }} />
        <View className="flex-1 p-4 bg-white">
          <Text className="text-red-500">Publicación no encontrada</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: publicacion.titulo }} />
      <ScrollView className="flex-1 p-4 bg-white">
        <Text className="text-2xl font-bold mb-4">{publicacion.titulo}</Text>
        <Text className="mb-4">{publicacion.descripcion}</Text>
        <Text className="text-lg font-bold mb-2">Comentarios:</Text>
        {
          publicacion.comentarios.map((c, idx) => (
            <TouchableOpacity
              key={idx}
              className="p-3 bg-gray-100 rounded-lg mb-2"
              onPress={() => router.push(`/publicaciones/${idPublicacion}/comentario/${c.id}`)}
            >
              <Text>{c.texto}</Text>
            </TouchableOpacity>
          ))
        }
      </ScrollView>
    </>
  );
}
