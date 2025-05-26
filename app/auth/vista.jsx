import { useState } from 'react';
import { SafeAreaView, Text, View } from "react-native";
import Pomo from '../components/Pomo';
import Tiempo from '../components/Tiempo';

const colores = {
  POMODORO: "#bde0fe",
  DESCANSO: "#f9c74f",
  "LARGO DESCANSO": "#90be6d",
};

export default function HomePage() {
    const [isWelcome, setIsWelcome] = useState(false);
    const [tiempo, setTiempo] = useState(60 * 25); 
    const [corre, setCorre] = useState("POMODORO");

return (
    <SafeAreaView style={[styles.container, { backgroundColor: colores[corre] }]}>
    <View style={{flex: 1, paddinghorizontal:15}}>
    <Text style={styles.text}>Tiempo que va a transcurrir</Text>
    <Text style={styles.text}>{tiempo} segundos</Text>
    <Pomo corre={corre} setCorre={setCorre} setTiempo={setTiempo} />
    <Tiempo tiempo={tiempo} />
    </View>
    </SafeAreaView>
);
}

const styles = {
container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
},
text: {
    fontSize: 24,
    color: 'blue',
    textAlign: 'center',
    margin: 20,
}
}
