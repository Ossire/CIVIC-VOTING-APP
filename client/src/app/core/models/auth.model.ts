export interface User {
  id: string;
  name: string;
  email: string;
  state: string;
  role: 'admin' | 'user';
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
