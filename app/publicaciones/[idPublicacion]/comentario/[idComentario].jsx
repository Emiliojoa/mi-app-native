import { comentarios } from '@/constants/data';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

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
            <Stack.Screen options={{ title: `Comentario de ${publicacion.titulo}` }} />
            <ScrollView className="flex-1 p-4 bg-white">
                <Text className="text-2xl font-bold mb-4">{publicacion.titulo}</Text>
                <Text className="mb-4">{comentario.texto}</Text>
                <Text className="text-sm text-gray-500">Autor: {comentario.autor}</Text>
            </ScrollView>
        </>
    );
} 