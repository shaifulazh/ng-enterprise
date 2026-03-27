import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

export interface TokenResponse {
  access_token:  string;
  token_type:    string;
  expires_in:    number;
  refresh_token?: string;
  scope:         string;
  id_token?:     string;
}

@Injectable({ providedIn: 'root' })
export class OAuthService {
  private readonly http = inject(HttpClient);

  /** Generate cryptographically random PKCE verifier */
  generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  /** SHA-256 hash → base64url (PKCE challenge) */
  async generateCodeChallenge(verifier: string): Promise<string> {
    const data = new TextEncoder().encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  /** Generate anti-CSRF state parameter */
  generateState(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  /** Build authorization URL and redirect browser */
  async initiateAuthorizationCodeFlow(): Promise<string> {
    const verifier   = this.generateCodeVerifier();
    const challenge  = await this.generateCodeChallenge(verifier);
    const state      = this.generateState();

    const params = new URLSearchParams({
      response_type:         'code',
      client_id:             environment.clientId,
      redirect_uri:          environment.redirectUri,
      scope:                 environment.scopes,
      state,
      code_challenge:        challenge,
      code_challenge_method: 'S256',
    });

    // Store state in sessionStorage for CSRF verification (not the token!)
    sessionStorage.setItem('oauth_state', state);
    sessionStorage.setItem('code_verifier', verifier);

    const authUrl = `${environment.authUrl}/oauth2/authorize?${params}`;
    window.location.href = authUrl;

    return verifier; // caller stores this in NgRx (memory only)
  }

  /** Exchange authorization code for tokens */
  exchangeCodeForToken(code: string, verifier: string): Observable<TokenResponse> {
    const body = new HttpParams()
      .set('grant_type',    'authorization_code')
      .set('client_id',     environment.clientId)
      .set('redirect_uri',  environment.redirectUri)
      .set('code',          code)
      .set('code_verifier', verifier);

    return this.http.post<TokenResponse>(
      `/oauth2/token`,
      body.toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );
  }

  /** Silent refresh using HttpOnly cookie (sent automatically) */
  refreshAccessToken(): Observable<TokenResponse> {
    const body = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('client_id',  environment.clientId);

    return this.http.post<TokenResponse>(
      `${environment.authUrl}/oauth2/token`,
      body.toString(),
      {
        headers:      { 'Content-Type': 'application/x-www-form-urlencoded' },
        withCredentials: true, // sends HttpOnly refresh_token cookie
      },
    );
  }

  /** Revoke tokens on logout */
  revokeToken(token: string): Observable<void> {
    const body = new HttpParams()
      .set('token',     token)
      .set('client_id', environment.clientId);

    return this.http.post<void>(
      `${environment.authUrl}/oauth2/revoke`,
      body.toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );
  }

  /** Fetch OIDC userinfo */
  getUserInfo(accessToken: string): Observable<Record<string, unknown>> {
    return this.http.get<Record<string, unknown>>(
      `/portal/api/user`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
  }

  /** Verify state to prevent CSRF */
  verifyState(returnedState: string): boolean {
    const stored = sessionStorage.getItem('oauth_state');
    // sessionStorage.removeItem('oauth_state');
    return stored === returnedState;
  }
}
