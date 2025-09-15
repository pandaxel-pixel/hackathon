import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

import AuthScreen from './src/screens/AuthScreen';
import CollectorApp from './src/screens/CollectorApp';
import PosterApp from './src/screens/PosterApp';
import { authApi } from './src/api/mockApi';
import { User } from './src/types';

const Stack = createStackNavigator();

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const user = await authApi.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Error loading current user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCurrentUser();
  }, []);

  const handleAuth = async (user: User) => {
    if (!user.role) {
      console.error('User authenticated but no role selected');
      return;
    }
    await AsyncStorage.setItem('ecociclo_user', JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('ecociclo_user');
    setCurrentUser(null);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#059669" />
        <Text style={styles.loadingText}>Cargando EcoCiclo...</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!currentUser ? (
          <Stack.Screen name="Auth">
            {(props) => <AuthScreen {...props} onAuth={handleAuth} />}
          </Stack.Screen>
        ) : currentUser.role === 'collector' ? (
          <Stack.Screen name="CollectorApp">
            {(props) => <CollectorApp {...props} currentUser={currentUser} onLogout={handleLogout} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="PosterApp">
            {(props) => <PosterApp {...props} currentUser={currentUser} onLogout={handleLogout} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
});