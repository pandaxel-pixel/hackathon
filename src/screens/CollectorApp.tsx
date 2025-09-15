import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { User } from '../types';

const Tab = createBottomTabNavigator();

interface CollectorAppProps {
  currentUser: User;
  onLogout: () => void;
}

// Placeholder screens - we'll implement these next
function HomeScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Inicio - Recolector</Text>
      <Text style={styles.subtitle}>Elementos disponibles para recoger</Text>
    </View>
  );
}

function BagsScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Mis Bolsas</Text>
      <Text style={styles.subtitle}>Recolecciones pendientes y completadas</Text>
    </View>
  );
}

function StatsScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Estadísticas</Text>
      <Text style={styles.subtitle}>Tu rendimiento como recolector</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Perfil</Text>
      <Text style={styles.subtitle}>Configuración y cuenta</Text>
    </View>
  );
}

export default function CollectorApp({ currentUser, onLogout }: CollectorAppProps) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#059669',
        tabBarInactiveTintColor: '#6b7280',
        headerStyle: {
          backgroundColor: '#059669',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen 
        name="Inicio" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏠</Text>,
          headerTitle: `EcoCiclo - ${currentUser.username}`,
        }}
      />
      <Tab.Screen 
        name="Bolsas" 
        component={BagsScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🛍️</Text>,
        }}
      />
      <Tab.Screen 
        name="Estadísticas" 
        component={StatsScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📊</Text>,
        }}
      />
      <Tab.Screen 
        name="Perfil" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});