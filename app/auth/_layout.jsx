import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'black',
          borderTopWidth: 0,
          elevation: 10,
          height: 100,
        },
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#a0a0a0',
        tabBarLabel: ({ focused, color }) => (
          <Text
            className={`text-xs font-semibold mb-1 ${focused ? 'text-white' : 'text-gray-400'}`}
          >
            {route.name === 'index'
              ? 'Home'
              : route.name === 'vista'
              ? 'Vista'
              : route.name === 'scroll'
              ? 'Revisión'
              : route.name === 'publicaciones'
              ? 'Publicaciones'
              : route.name === 'logout'
              ? 'Logout'
              : ''}
          </Text>
        ),
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'index') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'vista') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'scroll') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'publicaciones') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          } else if (route.name === 'logout') {
            iconName = focused ? 'log-out' : 'log-out-outline';
          } else {
            iconName = focused ? 'alert' : 'alert-outline';
          }

          return (
            <View className="items-center justify-center w-full">
              <Ionicons name={iconName} size={size} color={color} />
              {focused && (
                <View className="bg-white rounded h-1 w-5 mt-1" />
              )}
            </View>
          );
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="vista"
        options={{
          title: 'Vista',
          tabBarLabel: 'Vista',
        }}
      />
      <Tabs.Screen
        name="scroll"
        options={{
          title: 'Revisión',
          tabBarLabel: 'Revisión',
        }}
      />
      <Tabs.Screen
        name="publicaciones"
        options={{
          title: 'Publicaciones',
          tabBarLabel: 'Publicaciones',
        }}
      />
      <Tabs.Screen
        name="logout"
        options={{
          title: 'Logout',
          tabBarLabel: 'Logout',
        }}
      />
    </Tabs>
  );
}