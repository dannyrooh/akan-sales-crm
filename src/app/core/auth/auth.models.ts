export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'manager' | 'sales_rep';
  avatar_url?: string;
  is_active: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface ApiError {
  detail: string;
  status_code: number;
}
