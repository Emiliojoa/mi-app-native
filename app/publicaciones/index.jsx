import { router, Stack } from 'expo-router';
import { FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { comentarios } from "../../constants/data";



export default function Publicaciones(){
    return(
        <>
        <View>
            <TouchableOpacity onPress={() => router.back()}>
                <Text className="text-2xl font-bold">{"<"}</Text>
            </TouchableOpacity>
        </View>
        <Stack.Screen options={{ title: "Publicaciones" }} />
        <ScrollView className="flex-1 bg-white p-4 mt-2 mb-2">
            <FlatList
            data={comentarios}
            renderItem={({ item }) => (
                <TouchableOpacity
                    key={item.id}
                    className="p-4 border-b border-gray-200 rounded-lg shadow-lg"
                    onPress={() => router.push(`/publicaciones/${item.id}`)}
                >
                    <Text className="text-lg font-bold mt-2 ">{item.titulo}</Text>
                    <Text className="text-gray-500 mt-2">{item.fecha}</Text>
                    <Text className="mt-2 text-gray-700">{item.descripcion}</Text>
                    <Text className="mt-2 text-sm text-gray-500 mb-2">
                        {item.comentarios.length} comentarios
                    </Text>
                </TouchableOpacity>
            )}
            />
            </ScrollView>
        </>
    )
} 