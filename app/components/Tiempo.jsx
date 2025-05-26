import { StyleSheet, Text, View } from "react-native";


export default function Tiempo({tiempo}) {
    const minutos =`${Math.floor(tiempo / 60).toString().padStart(2, '0')}:${(tiempo % 60).toString().padStart(2, '0')}`
  return (
    <View style={styles.container}>
        <Text style={styles.tiempo}>
        {minutos}
        </Text>
        </View>
  )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        flex: 0.2,
        backgroundColor: "#F2F2F2",
        padding: 15,
        borderRadius: 10,
    },
    tiempo: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#33333",
    },
})
