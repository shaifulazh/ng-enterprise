# Angular 21 Enterprise Starter

Production-grade Angular 21 application with NgRx, Tailwind CSS, and OAuth2 PKCE authentication.

## Stack

- **Angular 21** — Standalone APIs, Zoneless, Signal-first
- **NgRx** — store, effects, entity, router-store, devtools
- **Tailwind CSS 4** — Dark mode, responsive, utility-first
- **Spring Boot 3.5** OAuth2 Authorization Server (PKCE)

## Quick Start

```bash
npm install
npm start
```

## Project Structure

```
src/app/
├── core/                     # Singleton services, guards, interceptors
│   ├── guards/               # AuthGuard, RoleGuard
│   ├── interceptors/         # JWT attach, 401 refresh-retry
│   ├── services/             # OAuthService, TokenService, ApiService
│   └── store/                # Root NgRx slices
│       ├── auth/             # Auth state (user, token, status)
│       ├── router/           # Custom router serializer + selectors
│       ├── layout/           # Sidebar + mobile state
│       └── settings/         # Theme + language (persisted)
├── shared/
│   ├── layout/               # MainLayout, Sidebar, TopNavbar, LayoutShell
│   └── components/           # Reusable UI atoms
└── features/
    ├── dashboard/            # Default route, stats + charts
    ├── module-a/             # Lazy feature
    ├── module-b/             # Lazy feature
    └── module-c/             # Lazy feature
```

## Auth Flow (OAuth2 PKCE)

1. User navigates to app → `AuthGuard` checks store
2. No token → redirect to Spring Boot `/oauth2/authorize` with PKCE challenge
3. Spring Boot redirects back to `/callback?code=...`
4. `CallbackComponent` dispatches `exchangeCodeForToken`
5. Effect exchanges code for JWT via `/oauth2/token`
6. Access token stored in `TokenService` (in-memory only)
7. `AuthInterceptor` attaches `Bearer <token>` to every API request
8. On 401 → interceptor queues request, triggers silent refresh, retries
9. Silent refresh uses HttpOnly refresh token cookie (server-managed)

## Environment Configuration

```typescript
// environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  authUrl: 'http://localhost:8080',
  clientId: 'angular-client',
  redirectUri: 'http://localhost:4200/callback',
  scopes: 'openid profile email offline_access',
};
```
