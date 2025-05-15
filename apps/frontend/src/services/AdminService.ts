import { serviceUrl } from '../constants';

interface User {
  id: string;
  username: string;
  role: string;
  // Otros campos que necesites
}

export class AdminService {
  static async getUsers(): Promise<User[] | undefined> {
    try {
      const response = await fetch(`${serviceUrl}/admin/users`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  static async deleteUser(userId: string): Promise<void> {
    try {
      const response = await fetch(`${serviceUrl}/admin/user`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}
