import { comentarios } from '@/constants/data';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ComentarioDetalle(){
    const { idPublicacion, idComentario } = useLocalSearchParams();
    const publicacion = comentarios.find((p) => p.id === idPublicacion);
    const comentario = publicacion?.comentarios.find((c) => c.id === idComentario);



    if (!publicacion || !comentario) {
        return (
            <>
                <Stack.Screen options={{ title: 'Comentario no encontrado' }} />
                <View className="flex-1 p-4 bg-white">
                    <Text className="text-red-500">Comentario no encontrado</Text>
                </View>
            </>
        );
    }
    return (
        <>
         <View>
                  <TouchableOpacity onPress={() => router.back()}>
                      <Text className="text-2xl font-bold">{"<"}</Text>
                  </TouchableOpacity>
        </View>
            <Stack.Screen options={{ title: `Comentario de ${publicacion.titulo}` }} />
            <ScrollView className="flex-1 p-4 bg-white">
                <Text className="text-2xl font-bold mb-4">{publicacion.titulo}</Text>
                <Text className="mb-4">{comentario.texto}</Text>
                <Text className="text-sm text-gray-500">Autor: {comentario.autor}</Text>
            </ScrollView>
        </>
    );
} 