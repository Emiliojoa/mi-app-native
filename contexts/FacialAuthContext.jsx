import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { registerUser, recognizeUser } from '../services/FacialRecognitionAPI';

const FacialAuthContext = createContext();

// Keys para AsyncStorage
const STORAGE_KEYS = {
  FACIAL_REGISTERED: '@facial_registered',
  USER_CUIL: '@user_cuil',
  LAST_FACIAL_LOGIN: '@last_facial_login',
};

export const useFacialAuth = () => {
  const context = useContext(FacialAuthContext);
  if (!context) {
    throw new Error('useFacialAuth debe ser usado dentro de un FacialAuthProvider');
  }
  return context;
};

export const FacialAuthProvider = ({ children }) => {
  const [isFacialRegistered, setIsFacialRegistered] = useState(false);
  const [userCuil, setUserCuil] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar estado inicial desde AsyncStorage
  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const [registered, cuil] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.FACIAL_REGISTERED),
        AsyncStorage.getItem(STORAGE_KEYS.USER_CUIL),
      ]);

      setIsFacialRegistered(registered === 'true');
      setUserCuil(cuil || '');
    } catch (error) {
      console.error('Error cargando datos del almacenamiento:', error);
    }
  };

  const saveToStorage = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value.toString());
    } catch (error) {
      console.error('Error guardando en AsyncStorage:', error);
    }
  };

  /**
   * Registra un usuario con reconocimiento facial
   * @param {string} cuil - CUIL del usuario
   * @param {string} imageUri - URI de la foto capturada
   * @returns {Promise<Object>} - Resultado del registro
   */
  const registerFacialAuth = async (cuil, imageUri) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Iniciando registro facial para CUIL:', cuil);

      // Llamar a la API de registro
      const result = await registerUser(cuil, imageUri);

      // Guardar información en AsyncStorage
      await Promise.all([
        saveToStorage(STORAGE_KEYS.FACIAL_REGISTERED, 'true'),
        saveToStorage(STORAGE_KEYS.USER_CUIL, cuil),
      ]);

      // Actualizar estado local
      setIsFacialRegistered(true);
      setUserCuil(cuil);

      console.log('Registro facial exitoso:', result);
      return result;

    } catch (error) {
      console.error('Error en registro facial:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Intenta hacer login por reconocimiento facial
   * @param {string} imageUri - URI de la foto capturada
   * @returns {Promise<Object>} - Resultado del reconocimiento
   */
  const loginWithFace = async (imageUri) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Iniciando reconocimiento facial...');

      // Llamar a la API de reconocimiento
      const result = await recognizeUser(imageUri);

      // Guardar timestamp del último login facial exitoso
      await saveToStorage(STORAGE_KEYS.LAST_FACIAL_LOGIN, new Date().toISOString());

      console.log('Reconocimiento facial exitoso:', result);
      return result;

    } catch (error) {
      console.error('Error en reconocimiento facial:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Elimina el registro facial del usuario
   */
  const removeFacialRegistration = async () => {
    try {
      setLoading(true);

      // Limpiar AsyncStorage
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.FACIAL_REGISTERED),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_CUIL),
        AsyncStorage.removeItem(STORAGE_KEYS.LAST_FACIAL_LOGIN),
      ]);

      // Actualizar estado local
      setIsFacialRegistered(false);
      setUserCuil('');

      console.log('Registro facial eliminado');

    } catch (error) {
      console.error('Error eliminando registro facial:', error);
      setError('Error al eliminar registro facial');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtiene información sobre el último login facial
   */
  const getLastFacialLogin = async () => {
    try {
      const lastLogin = await AsyncStorage.getItem(STORAGE_KEYS.LAST_FACIAL_LOGIN);
      return lastLogin ? new Date(lastLogin) : null;
    } catch (error) {
      console.error('Error obteniendo último login facial:', error);
      return null;
    }
  };

  /**
   * Limpia errores
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * Verifica si el usuario puede usar reconocimiento facial
   */
  const canUseFacialAuth = () => {
    return isFacialRegistered && userCuil;
  };

  const value = {
    // Estado
    isFacialRegistered,
    userCuil,
    loading,
    error,

    // Funciones
    registerFacialAuth,
    loginWithFace,
    removeFacialRegistration,
    getLastFacialLogin,
    clearError,
    canUseFacialAuth,
    loadStoredData,
  };

  return (
    <FacialAuthContext.Provider value={value}>
      {children}
    </FacialAuthContext.Provider>
  );
};
