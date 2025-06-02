import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#a0a0a0',
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'index') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'vista') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'scroll') {
            iconName = focused ? 'list' : 'list-outline';
          }else if (route.name === '') {
            iconName = focused ? 'alert' : 'alert-outline';
          }else if(route.name === 'publicaciones'){
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          }


          return (
            <View style={styles.iconContainer}>
              <Ionicons name={iconName} size={size} color={color} />
              {focused && <View style={styles.activeIndicator} />}
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
          title: 'index',
          tabBarLabel: 'Publicaciones',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#333',
    borderTopWidth: 0,
    elevation: 8,
    height: 60,
    paddingBottom: 5,
    paddingTop: 5,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 3,
  },
  tabBarItem: {
    paddingTop: 5,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  activeIndicator: {
    backgroundColor: '#ffffff',
    borderRadius: 2,
    height: 4,
    marginTop: 4,
    width: 20,
  },
});