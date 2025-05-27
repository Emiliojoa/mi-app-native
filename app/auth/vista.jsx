import { useEffect, useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import "~/global.css";
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
    const [activo, setActivo] = useState(false);

useEffect(()=>{
    let intervalo = null;

    if(activo){
        intervalo=setInterval(()=>{
            setTiempo(tiempo-1)}
            
            , 1000)
        
    }else{
        clearInterval(intervalo)
    }
    return () => {
        clearInterval(intervalo);
    } 
},[activo, tiempo])

function empezar(){
        setActivo(!activo)
}

return (
    <SafeAreaView style={[styles.container, { backgroundColor: colores[corre] }]}>
        <View style={{ flex: 1, paddingHorizontal: 15 }}>
            <Text style={styles.text}>Tiempo que va a transcurrir</Text>
            <Text style={styles.text}>{tiempo} segundos</Text>
            <Pomo corre={corre} setCorre={setCorre} setTiempo={setTiempo} />
            <Tiempo tiempo={tiempo} />
            <TouchableOpacity onPress={empezar} style={styles.boton}>
                <Text style={{ color: "white", fontWeight: "bold", fontSize: 24, textAlign: 'center' }}>
                    {activo ? "Detener" : "Iniciar"}
                </Text>
            </TouchableOpacity>
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
},
boton: {
    backgroundColor: '#3333',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
}
}
