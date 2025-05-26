import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const opciones = ["POMODORO", "DESCANSO", "LARGO DESCANSO"];
const tiempos = [25, 5, 15]; 

export default function Pomo({ setTiempo, corre, setCorre }) {
    function handlePress(index) {
        setCorre(opciones[index]);
        setTiempo(tiempos[index] * 60); 
    }

    return (
        <View style={{ flexDirection: "row" }} >
            {opciones.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => handlePress(index)}
                    style={[
                        styles.opcion,
                        corre === item && { backgroundColor: '#bde0fe' }
                    ]}
                >
                    <Text style={{fontWeight:"bold"}}>{item}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    opcion: {
        flex: 1,
        padding: 10,
        margin: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
    }
});