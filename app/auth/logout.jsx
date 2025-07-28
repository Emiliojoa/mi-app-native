import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Button, View } from "react-native";

export default function LogoutPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("authenticated");
    router.replace("/");
  };

  return (
    <View className="flex-1 justify-center items-center bg-black">
      <Button title="Cerrar sesión" onPress={handleLogout} color="#007bff" />
    </View>
  );
}
