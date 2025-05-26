import { Tabs } from 'expo-router';

export default function RootLayout() {
  return (
    <Tabs screenOptions={{ headerStyle: { backgroundColor: 'red' }, headerShown: false }}>
        <Tabs.Screen name="index" options={{title:"home"}} />
        <Tabs.Screen name='vista' options={{title: "vista"}}/>
        <Tabs.Screen name='vista2' options={{title: "vista2"}}/>
    </Tabs>
  );
}
