import { router, Stack } from 'expo-router';
import { FlatList, ScrollView, Text, TouchableOpacity } from "react-native";
import { comentarios } from "../../constants/data";



export default function Publicaciones(){
    return(
        <>
        <Stack.Screen options={{ title: "Publicaciones" }} />
        <ScrollView className="flex-1 bg-white">
            <FlatList
            data={comentarios}
            renderItem={({ item }) => (
                <TouchableOpacity
                    key={item.id}
                    className="p-4 border-b border-gray-200"
                    onPress={() => router.push(`/publicaciones/${item.id}`)}
                >
                    <Text className="text-lg font-bold">{item.titulo}</Text>
                    <Text className="text-gray-500">{item.fecha}</Text>
                    <Text className="mt-2 text-gray-700">{item.descripcion}</Text>
                    <Text className="mt-2 text-sm text-gray-500">
                        {item.comentarios.length} comentarios
                    </Text>
                </TouchableOpacity>
            )}
            />
            </ScrollView>
        </>
    )
} 