import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo-icon">A</div>
          <h1>Akan Sales CRM</h1>
          <p>Faça login para acessar o painel</p>
        </div>

        @if (errorMessage()) {
          <div class="error-banner">
            <i class="pi pi-exclamation-circle"></i>
            {{ errorMessage() }}
          </div>
        }

        <form (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-field">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              [(ngModel)]="email"
              name="email"
              placeholder="seu@email.com"
              required
              [disabled]="authService.isLoading()"
            />
          </div>

          <div class="form-field">
            <label for="password">Senha</label>
            <input
              id="password"
              type="password"
              [(ngModel)]="password"
              name="password"
              placeholder="Sua senha"
              required
              [disabled]="authService.isLoading()"
            />
          </div>

          <button
            type="submit"
            class="login-btn"
            [disabled]="authService.isLoading() || !email || !password"
          >
            @if (authService.isLoading()) {
              <i class="pi pi-spinner pi-spin"></i>
              Entrando...
            } @else {
              <i class="pi pi-sign-in"></i>
              Entrar
            }
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: var(--akan-bg);
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      background: var(--akan-surface);
      border: 1px solid var(--akan-border);
      border-radius: 12px;
      padding: 40px 32px;
    }

    .login-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .logo-icon {
      width: 56px;
      height: 56px;
      background: var(--akan-primary);
      border-radius: 12px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 24px;
      color: white;
      margin-bottom: 16px;
    }

    .login-header h1 {
      font-size: 22px;
      font-weight: 700;
      color: var(--akan-text);
      margin-bottom: 4px;
    }

    .login-header p {
      font-size: 14px;
      color: var(--akan-text-muted);
    }

    .error-banner {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #fca5a5;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 13px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-field label {
      font-size: 13px;
      font-weight: 500;
      color: var(--akan-text-muted);
    }

    .form-field input {
      padding: 10px 14px;
      background: var(--akan-bg);
      border: 1px solid var(--akan-border);
      border-radius: 8px;
      color: var(--akan-text);
      font-size: 14px;
      outline: none;
      transition: border-color 0.15s;
    }

    .form-field input:focus {
      border-color: var(--akan-primary);
    }

    .form-field input::placeholder {
      color: var(--akan-text-muted);
      opacity: 0.5;
    }

    .login-btn {
      padding: 12px;
      background: var(--akan-primary);
      border: none;
      border-radius: 8px;
      color: white;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: background 0.15s;
    }

    .login-btn:hover:not(:disabled) {
      background: var(--akan-primary-hover);
    }

    .login-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class LoginComponent {
  readonly authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  readonly errorMessage = signal('');

  constructor() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  async onSubmit(): Promise<void> {
    this.errorMessage.set('');
    try {
      await this.authService.login({ email: this.email, password: this.password });
    } catch (err: unknown) {
      const error = err as { error?: { detail?: string } };
      this.errorMessage.set(error?.error?.detail ?? 'Erro ao fazer login. Tente novamente.');
    }
  }
}
