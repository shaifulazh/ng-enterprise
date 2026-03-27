export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com/api',
  authUrl: 'https://auth.yourdomain.com',
  clientId: 'angular-client',
  redirectUri: 'https://app.yourdomain.com/callback',
  scopes: 'openid profile email offline_access',
  tokenRefreshBufferMs: 60_000,
};
