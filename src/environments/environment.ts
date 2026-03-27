export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  authUrl: 'http://localhost:8080',
  clientId: 'angular-client',
  redirectUri: 'http://localhost:4200/callback',
  scopes: 'openid profile email read write',
  tokenRefreshBufferMs: 60_000, // refresh 60s before expiry
};
