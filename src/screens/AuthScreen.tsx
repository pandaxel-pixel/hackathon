import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { authApi } from '../api/mockApi';
import { User } from '../types';

interface AuthScreenProps {
  onAuth: (user: User) => void;
}

export default function AuthScreen({ onAuth }: AuthScreenProps) {
  const [isRegistering, setIsRegistering] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [showRoleSelection, setShowRoleSelection] = useState(false);

  const handleAuth = async () => {
    if (!username.trim() || !password.trim()) return;

    setIsLoading(true);

    try {
      if (!isRegistering) {
        // Login flow
        const user = await authApi.login(username.trim(), password);
        
        if (user) {
          if (user.role) {
            onAuth(user);
            return;
          } else {
            setLoggedInUser(user);
            setShowRoleSelection(true);
          }
        } else {
          Alert.alert('Error', 'Usuario o contraseña incorrectos');
        }
      } else {
        // Registration flow
        try {
          const newUser = await authApi.register(username.trim(), password);
          setLoggedInUser(newUser);
          setShowRoleSelection(true);
        } catch (error) {
          Alert.alert('Error', error instanceof Error ? error.message : 'Error al crear la cuenta');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelect = async (selectedRole: 'collector' | 'poster') => {
    if (!loggedInUser) return;

    setIsLoading(true);

    try {
      const updatedUser = await authApi.updateUserRole(loggedInUser.id, selectedRole);
      if (updatedUser) {
        onAuth(updatedUser);
      } else {
        Alert.alert('Error', 'Error al actualizar el rol del usuario');
      }
    } catch (error) {
      Alert.alert('Error', 'Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (showRoleSelection && loggedInUser) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.logo}>🌱 EcoCiclo</Text>
            <Text style={styles.welcomeTitle}>¡Bienvenido, {loggedInUser.username}!</Text>
            <Text style={styles.subtitle}>Selecciona cómo quieres usar EcoCiclo</Text>
          </View>

          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[styles.roleButton, styles.collectorButton]}
              onPress={() => handleRoleSelect('collector')}
              disabled={isLoading}
            >
              <View style={styles.roleIcon}>
                <Text style={styles.roleEmoji}>♻️</Text>
              </View>
              <View style={styles.roleContent}>
                <Text style={styles.roleTitle}>Soy Recolector</Text>
                <Text style={styles.roleDescription}>
                  Explora elementos disponibles, acepta recolecciones y escanea códigos QR
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleButton, styles.posterButton]}
              onPress={() => handleRoleSelect('poster')}
              disabled={isLoading}
            >
              <View style={styles.roleIcon}>
                <Text style={styles.roleEmoji}>📦</Text>
              </View>
              <View style={styles.roleContent}>
                <Text style={styles.roleTitle}>Tengo Reciclaje</Text>
                <Text style={styles.roleDescription}>
                  Crea bolsas de materiales, genera códigos QR y compite en rankings
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#059669" />
              <Text style={styles.loadingText}>Configurando tu cuenta...</Text>
            </View>
          )}

          <Text style={styles.footerText}>
            Puedes cambiar tu rol más tarde en la configuración
          </Text>
        </ScrollView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.logo}>🌱 EcoCiclo</Text>
          <Text style={styles.subtitle}>Conectando el reciclaje inteligente</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, !isRegistering && styles.activeTab]}
              onPress={() => setIsRegistering(false)}
            >
              <Text style={[styles.tabText, !isRegistering && styles.activeTabText]}>
                Iniciar Sesión
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, isRegistering && styles.activeTab]}
              onPress={() => setIsRegistering(true)}
            >
              <Text style={[styles.tabText, isRegistering && styles.activeTabText]}>
                Registrarse
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre de usuario</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Ingresa tu nombre de usuario"
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Ingresa tu contraseña"
              secureTextEntry
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, (!username.trim() || !password.trim() || isLoading) && styles.disabledButton]}
            onPress={handleAuth}
            disabled={!username.trim() || !password.trim() || isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#ffffff" />
                <Text style={styles.submitButtonText}>
                  {isRegistering ? 'Creando cuenta...' : 'Verificando credenciales...'}
                </Text>
              </View>
            ) : (
              <Text style={styles.submitButtonText}>
                {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
              </Text>
            )}
          </TouchableOpacity>

          <Text style={styles.footerText}>
            {isRegistering 
              ? 'Después de crear tu cuenta, podrás elegir si eres recolector o tienes elementos para reciclar'
              : 'Ingresa tus credenciales para acceder a EcoCiclo'
            }
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 8,
  },
  welcomeTitle: {
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
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#059669',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTabText: {
    color: 'white',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  submitButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  roleContainer: {
    marginVertical: 24,
  },
  roleButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  collectorButton: {
    borderColor: '#10b981',
  },
  posterButton: {
    borderColor: '#3b82f6',
  },
  roleIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  roleEmoji: {
    fontSize: 24,
  },
  roleContent: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});