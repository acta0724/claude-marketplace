export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export interface SignupRequest {
  email: string;
  password: string;
}

export interface SignupResponse {
  id: string;
  email: string;
  createdAt: Date;
}
