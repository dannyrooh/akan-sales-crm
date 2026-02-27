import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api/api.service';
import { ACTIVITY_TYPES } from '../../core/config/app.constants';

interface Activity {
  id: number;
  lead_id: number;
  lead_name?: string;
  user_id: string;
  type: string;
  title: string;
  description?: string;
  scheduled_at?: string;
  completed_at?: string;
  is_completed: boolean;
  created_at: string;
}

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="activities-page">
      <div class="page-header">
        <h2>Atividades</h2>
        <button class="add-btn" (click)="showForm.set(!showForm())">
          <i class="pi pi-plus"></i>
          Nova Atividade
        </button>
      </div>

      @if (showForm()) {
        <div class="form-card">
          <h3>Nova Atividade</h3>
          <form (ngSubmit)="createActivity()" class="activity-form">
            <div class="form-row">
              <div class="form-field">
                <label>Tipo</label>
                <select [(ngModel)]="newActivity.type" name="type">
                  @for (type of activityTypes; track type.value) {
                    <option [value]="type.value">{{ type.label }}</option>
                  }
                </select>
              </div>
              <div class="form-field">
                <label>Título</label>
                <input type="text" [(ngModel)]="newActivity.title" name="title" placeholder="Título da atividade" />
              </div>
            </div>
            <div class="form-field">
              <label>Descrição</label>
              <textarea [(ngModel)]="newActivity.description" name="description" rows="2" placeholder="Descrição (opcional)"></textarea>
            </div>
            <div class="form-field">
              <label>Agendar para</label>
              <input type="datetime-local" [(ngModel)]="newActivity.scheduled_at" name="scheduled_at" />
            </div>
            <div class="form-actions">
              <button type="button" class="cancel-btn" (click)="showForm.set(false)">Cancelar</button>
              <button type="submit" class="submit-btn" [disabled]="!newActivity.title">Salvar</button>
            </div>
          </form>
        </div>
      }

      <div class="activities-list">
        @for (activity of activities(); track activity.id) {
          <div class="activity-card" [class.activity-completed]="activity.is_completed">
            <div class="activity-icon" [title]="activity.type">
              <i [class]="getIcon(activity.type)"></i>
            </div>
            <div class="activity-content">
              <div class="activity-header">
                <span class="activity-title">{{ activity.title }}</span>
                @if (activity.lead_name) {
                  <span class="activity-lead">{{ activity.lead_name }}</span>
                }
              </div>
              @if (activity.description) {
                <p class="activity-desc">{{ activity.description }}</p>
              }
              <span class="activity-date">
                @if (activity.scheduled_at) {
                  Agendado: {{ formatDate(activity.scheduled_at) }}
                } @else {
                  Criado: {{ formatDate(activity.created_at) }}
                }
              </span>
            </div>
            <button
              class="complete-btn"
              [class.completed]="activity.is_completed"
              (click)="toggleComplete(activity)"
              [title]="activity.is_completed ? 'Concluída' : 'Marcar como concluída'"
            >
              <i class="pi" [class.pi-check-circle]="activity.is_completed" [class.pi-circle]="!activity.is_completed"></i>
            </button>
          </div>
        } @empty {
          <div class="empty-state">
            <i class="pi pi-check-square"></i>
            <h3>Nenhuma atividade</h3>
            <p>Crie atividades para acompanhar seus leads</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .activities-page {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .page-header h2 {
      font-size: 20px;
      font-weight: 700;
    }

    .add-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: var(--akan-primary);
      border: none;
      border-radius: 8px;
      color: white;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
    }

    .form-card {
      background: var(--akan-surface);
      border: 1px solid var(--akan-border);
      border-radius: 12px;
      padding: 20px;
    }

    .form-card h3 {
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 16px;
    }

    .activity-form {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 12px;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .form-field label {
      font-size: 12px;
      font-weight: 500;
      color: var(--akan-text-muted);
    }

    .form-field input,
    .form-field select,
    .form-field textarea {
      padding: 8px 12px;
      background: var(--akan-bg);
      border: 1px solid var(--akan-border);
      border-radius: 6px;
      color: var(--akan-text);
      font-size: 13px;
      outline: none;
    }

    .form-field input:focus,
    .form-field select:focus,
    .form-field textarea:focus {
      border-color: var(--akan-primary);
    }

    .form-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }

    .cancel-btn {
      padding: 8px 16px;
      background: none;
      border: 1px solid var(--akan-border);
      border-radius: 6px;
      color: var(--akan-text-muted);
      cursor: pointer;
      font-size: 13px;
    }

    .submit-btn {
      padding: 8px 16px;
      background: var(--akan-primary);
      border: none;
      border-radius: 6px;
      color: white;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
    }

    .submit-btn:disabled {
      opacity: 0.5;
    }

    .activities-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .activity-card {
      display: flex;
      align-items: center;
      gap: 14px;
      background: var(--akan-surface);
      border: 1px solid var(--akan-border);
      border-radius: 10px;
      padding: 14px 16px;
    }

    .activity-completed {
      opacity: 0.6;
    }

    .activity-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: var(--akan-bg);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .activity-icon i {
      font-size: 16px;
      color: var(--akan-primary);
    }

    .activity-content {
      flex: 1;
    }

    .activity-header {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .activity-title {
      font-size: 13px;
      font-weight: 600;
    }

    .activity-lead {
      font-size: 11px;
      color: var(--akan-primary);
      background: rgba(99, 102, 241, 0.1);
      padding: 1px 8px;
      border-radius: 4px;
    }

    .activity-desc {
      font-size: 12px;
      color: var(--akan-text-muted);
      margin-top: 4px;
    }

    .activity-date {
      font-size: 11px;
      color: var(--akan-text-muted);
      margin-top: 4px;
      display: block;
    }

    .complete-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 20px;
      color: var(--akan-text-muted);
    }

    .complete-btn.completed {
      color: var(--akan-success);
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 60px;
      color: var(--akan-text-muted);
      gap: 8px;
    }

    .empty-state i {
      font-size: 48px;
      opacity: 0.2;
    }

    .empty-state h3 {
      color: var(--akan-text);
    }

    .empty-state p {
      font-size: 13px;
    }
  `]
})
export class ActivitiesComponent implements OnInit {
  private api = inject(ApiService);

  readonly activities = signal<Activity[]>([]);
  readonly showForm = signal(false);
  readonly activityTypes = ACTIVITY_TYPES;

  newActivity = {
    type: 'task',
    title: '',
    description: '',
    scheduled_at: '',
  };

  ngOnInit(): void {
    this.loadActivities();
  }

  getIcon(type: string): string {
    return ACTIVITY_TYPES.find(t => t.value === type)?.icon ?? 'pi pi-circle';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('pt-BR');
  }

  createActivity(): void {
    if (!this.newActivity.title) return;
    this.api.post('/activities', this.newActivity).subscribe({
      next: () => {
        this.showForm.set(false);
        this.newActivity = { type: 'task', title: '', description: '', scheduled_at: '' };
        this.loadActivities();
      },
    });
  }

  toggleComplete(activity: Activity): void {
    this.api.patch(`/activities/${activity.id}/complete`).subscribe({
      next: () => this.loadActivities(),
    });
  }

  private loadActivities(): void {
    this.api.get<Activity[]>('/activities').subscribe({
      next: data => this.activities.set(Array.isArray(data) ? data : []),
      error: () => {},
    });
  }
}
