import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, LoginRequest, TokenResponse } from './auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly _currentUser = signal<User | null>(null);
  private readonly _isLoading = signal(false);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);
  readonly userRole = computed(() => this._currentUser()?.role ?? null);

  constructor() {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const token = this.getToken();
    const stored = localStorage.getItem('akan_user');
    if (token && stored) {
      try {
        this._currentUser.set(JSON.parse(stored));
      } catch {
        this.clearAuth();
      }
    }
  }

  async login(credentials: LoginRequest): Promise<void> {
    this._isLoading.set(true);
    try {
      const response = await firstValueFrom(
        this.http.post<TokenResponse>(`${environment.apiUrl}/auth/login`, credentials)
      );
      localStorage.setItem(environment.jwtTokenKey, response.access_token);
      localStorage.setItem(environment.jwtRefreshKey, response.refresh_token);
      localStorage.setItem('akan_user', JSON.stringify(response.user));
      this._currentUser.set(response.user);
      this.router.navigate(['/dashboard']);
    } finally {
      this._isLoading.set(false);
    }
  }

  async refreshToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem(environment.jwtRefreshKey);
    if (!refreshToken) return null;

    try {
      const response = await firstValueFrom(
        this.http.post<TokenResponse>(`${environment.apiUrl}/auth/refresh`, {
          refresh_token: refreshToken,
        })
      );
      localStorage.setItem(environment.jwtTokenKey, response.access_token);
      localStorage.setItem(environment.jwtRefreshKey, response.refresh_token);
      return response.access_token;
    } catch {
      this.logout();
      return null;
    }
  }

  logout(): void {
    this.clearAuth();
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(environment.jwtTokenKey);
  }

  private clearAuth(): void {
    localStorage.removeItem(environment.jwtTokenKey);
    localStorage.removeItem(environment.jwtRefreshKey);
    localStorage.removeItem('akan_user');
    this._currentUser.set(null);
  }
}
