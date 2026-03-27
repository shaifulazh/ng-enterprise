export type AuthStatus =
  | 'idle'
  | 'loading'
  | 'authenticated'
  | 'refreshing'
  | 'error';

export interface User {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  roles: string[];
}

export interface AuthState {
  user:            User | null;
  accessToken:     string | null; // in-memory only — never persisted
  tokenExpiresAt:  number | null; // epoch ms
  status:          AuthStatus;
  error:           string | null;
  pkceVerifier:    string | null; // ephemeral, cleared after exchange
}

export const initialAuthState: AuthState = {
  user:           null,
  accessToken:    null,
  tokenExpiresAt: null,
  status:         'idle',
  error:          null,
  pkceVerifier:   null,
};
