import { serviceUrl } from '../constants';

interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
}

export class AuthService {
  static async login(username: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${serviceUrl}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, message: 'Error al iniciar sesión' };
    }
  }

  static async register(username: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${serviceUrl}/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, message: 'Error al registrarse' };
    }
  }

  static async logout(): Promise<void> {
    try {
      await fetch(`${serviceUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  static async isAuthenticated(): Promise<boolean> {
    try {
        const response = await fetch(`${serviceUrl}/auth/check`, {
            credentials: 'include',
        });
        return response.ok;
    } catch (error) {
        return false;
    }
  }

  static async getUser(): Promise<any> {
    try {
      const response = await fetch(`${serviceUrl}/auth/check`, {
        credentials: 'include',
      });
      if (response.ok) {
        return response.json();
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}
