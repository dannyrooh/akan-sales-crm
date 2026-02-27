import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api/api.service';
import { environment } from '../../../environments/environment';

interface ConversationLead {
  id: number;
  name: string;
  phone: string;
  classification: string;
  last_message?: string;
  last_message_at?: string;
}

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

@Component({
  selector: 'app-conversations',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="conversations-page">
      <div class="conv-sidebar">
        <div class="conv-sidebar-header">
          <h3>Conversas</h3>
        </div>
        <div class="conv-list">
          @for (lead of leads(); track lead.id) {
            <div
              class="conv-item"
              [class.conv-active]="selectedLeadId() === lead.id"
              (click)="selectLead(lead)"
            >
              <div class="conv-avatar">{{ lead.name.charAt(0) }}</div>
              <div class="conv-info">
                <span class="conv-name">{{ lead.name }}</span>
                <span class="conv-preview">{{ lead.last_message ?? 'Sem mensagens' }}</span>
              </div>
              @switch (lead.classification) {
                @case ('quente') { <span class="badge badge-hot">Q</span> }
                @case ('morno') { <span class="badge badge-warm">M</span> }
                @case ('frio') { <span class="badge badge-cold">F</span> }
              }
            </div>
          } @empty {
            <div class="conv-empty">
              <p>Nenhuma conversa ainda</p>
            </div>
          }
        </div>
      </div>

      <div class="conv-main">
        @if (selectedLeadId()) {
          <div class="messages-container">
            <div class="messages-list">
              @for (msg of messages(); track msg.id) {
                <div class="message" [class.message-user]="msg.role === 'user'" [class.message-assistant]="msg.role === 'assistant'">
                  <div class="message-bubble">
                    <p>{{ msg.content }}</p>
                    <span class="message-time">{{ formatTime(msg.created_at) }}</span>
                  </div>
                </div>
              } @empty {
                <div class="no-messages">
                  <i class="pi pi-comments"></i>
                  <p>Nenhuma mensagem</p>
                </div>
              }
            </div>

            <div class="message-input">
              <input
                type="text"
                placeholder="Enviar mensagem manual..."
                [(ngModel)]="newMessage"
                (keydown.enter)="sendMessage()"
              />
              <button (click)="sendMessage()" [disabled]="!newMessage.trim()">
                <i class="pi pi-send"></i>
              </button>
            </div>
          </div>
        } @else {
          <div class="no-selection">
            <i class="pi pi-comments"></i>
            <h3>Selecione uma conversa</h3>
            <p>Escolha um lead para ver o histórico de conversas da IA</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .conversations-page {
      display: flex;
      height: calc(100vh - var(--topbar-height) - 48px);
      background: var(--akan-surface);
      border-radius: 12px;
      border: 1px solid var(--akan-border);
      overflow: hidden;
    }

    .conv-sidebar {
      width: 320px;
      border-right: 1px solid var(--akan-border);
      display: flex;
      flex-direction: column;
    }

    .conv-sidebar-header {
      padding: 16px;
      border-bottom: 1px solid var(--akan-border);
    }

    .conv-sidebar-header h3 {
      font-size: 15px;
      font-weight: 600;
    }

    .conv-list {
      flex: 1;
      overflow-y: auto;
    }

    .conv-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      cursor: pointer;
      border-bottom: 1px solid var(--akan-border);
      transition: background 0.1s;
    }

    .conv-item:hover {
      background: var(--akan-surface-hover);
    }

    .conv-active {
      background: rgba(99, 102, 241, 0.1) !important;
      border-left: 3px solid var(--akan-primary);
    }

    .conv-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--akan-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
      color: white;
      flex-shrink: 0;
    }

    .conv-info {
      flex: 1;
      min-width: 0;
    }

    .conv-name {
      font-size: 13px;
      font-weight: 600;
      display: block;
    }

    .conv-preview {
      font-size: 12px;
      color: var(--akan-text-muted);
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .conv-empty {
      padding: 40px 20px;
      text-align: center;
      color: var(--akan-text-muted);
      font-size: 13px;
    }

    .conv-main {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .messages-container {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .messages-list {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .message {
      display: flex;
    }

    .message-user {
      justify-content: flex-end;
    }

    .message-bubble {
      max-width: 70%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 13px;
      line-height: 1.5;
    }

    .message-user .message-bubble {
      background: var(--akan-primary);
      color: white;
      border-bottom-right-radius: 4px;
    }

    .message-assistant .message-bubble {
      background: var(--akan-bg);
      border-bottom-left-radius: 4px;
    }

    .message-time {
      font-size: 10px;
      color: var(--akan-text-muted);
      display: block;
      margin-top: 4px;
    }

    .message-user .message-time {
      color: rgba(255, 255, 255, 0.6);
    }

    .no-messages {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--akan-text-muted);
      gap: 8px;
    }

    .no-messages i {
      font-size: 40px;
      opacity: 0.3;
    }

    .message-input {
      display: flex;
      gap: 8px;
      padding: 16px;
      border-top: 1px solid var(--akan-border);
    }

    .message-input input {
      flex: 1;
      padding: 10px 14px;
      background: var(--akan-bg);
      border: 1px solid var(--akan-border);
      border-radius: 8px;
      color: var(--akan-text);
      font-size: 13px;
      outline: none;
    }

    .message-input input:focus {
      border-color: var(--akan-primary);
    }

    .message-input button {
      padding: 10px 16px;
      background: var(--akan-primary);
      border: none;
      border-radius: 8px;
      color: white;
      cursor: pointer;
    }

    .message-input button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .no-selection {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--akan-text-muted);
      gap: 8px;
    }

    .no-selection i {
      font-size: 48px;
      opacity: 0.2;
    }

    .no-selection h3 {
      font-size: 16px;
      color: var(--akan-text);
    }

    .no-selection p {
      font-size: 13px;
    }
  `]
})
export class ConversationsComponent implements OnInit, OnDestroy {
  private api = inject(ApiService);

  readonly leads = signal<ConversationLead[]>([]);
  readonly selectedLeadId = signal<number | null>(null);
  readonly messages = signal<Message[]>([]);

  newMessage = '';
  private pollInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.loadLeads();
  }

  ngOnDestroy(): void {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  selectLead(lead: ConversationLead): void {
    this.selectedLeadId.set(lead.id);
    this.loadMessages(lead.id);
    this.startPolling(lead.id);
  }

  sendMessage(): void {
    const leadId = this.selectedLeadId();
    const content = this.newMessage.trim();
    if (!leadId || !content) return;

    this.api.post(`/leads/${leadId}/conversations`, { content }).subscribe({
      next: () => {
        this.newMessage = '';
        this.loadMessages(leadId);
      },
    });
  }

  formatTime(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  private loadLeads(): void {
    this.api.get<ConversationLead[]>('/leads', { page_size: 100 }).subscribe({
      next: (data: unknown) => {
        const response = data as { data?: ConversationLead[] };
        this.leads.set(response.data ?? []);
      },
      error: () => {},
    });
  }

  private loadMessages(leadId: number): void {
    this.api.get<Message[]>(`/leads/${leadId}/conversations`).subscribe({
      next: data => this.messages.set(data),
      error: () => this.messages.set([]),
    });
  }

  private startPolling(leadId: number): void {
    if (this.pollInterval) clearInterval(this.pollInterval);
    this.pollInterval = setInterval(() => {
      this.loadMessages(leadId);
    }, environment.pollingIntervalMs);
  }
}
