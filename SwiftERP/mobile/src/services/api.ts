import axios from 'axios';
import * as Keychain from 'react-native-keychain';

const API_BASE_URL = 'http://10.0.2.2:5001/api/v1'; // 10.0.2.2 for Android Emulator, localhost for iOS

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials && credentials.password) {
      config.headers.Authorization = `Bearer ${credentials.password}`;
    }
  } catch (error) {
    console.error('Failed to retrieve credentials from Keychain', error);
  }
  return config;
});

export const authStorage = {
  saveToken: async (username: string, token: string) => {
    await Keychain.setGenericPassword(username, token);
  },
  getToken: async () => {
    const creds = await Keychain.getGenericPassword();
    return creds ? creds.password : null;
  },
  clearToken: async () => {
    await Keychain.resetGenericPassword();
  }
};
