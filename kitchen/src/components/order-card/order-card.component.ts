import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '../../types/order.interface';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="order-card glass-effect fade-in" 
         [class.urgent-order]="order.isUrgent"
         [class]="'status-theme-' + order.status.toLowerCase()">
      
      <div class="card-header">
        <div class="table-info">
          <div class="table-number-container">
            <h3 class="table-number">Table: {{ order.tableNumber }}</h3>
          </div>
          <div class="status-badge-container">
            <span class="status-dot" [class]="order.status.toLowerCase()"></span>
            <span class="status-badge" [class]="'status-' + order.status.toLowerCase()">
              {{ getStatusLabel(order.status) }}
            </span>
          </div>
        </div>
        
        <div class="time-display">
          <div class="time-icon-wrapper">
            <span class="time-icon">⏰</span>
          </div>
          <div class="time-content">
            <span class="time-value" [class.time-warning]="order.isUrgent">
              {{ order.timeElapsed }}<span class="time-unit">min</span>
            </span>
            <span class="estimated-time" *ngIf="order.estimatedTime">
              / {{ order.estimatedTime }}min
            </span>
          </div>
        </div>
      </div>

      <div class="progress-section" *ngIf="order.status !== 'PRETE' && order.status !== 'SERVIE'">
        <div class="progress-bar">
          <div class="progress-fill" 
               [class]="'bg-' + order.status.toLowerCase()" 
               [style.width.%]="getProgressPercentage()">
          </div>
        </div>
        <div class="progress-label">
          <span>Progression: {{ getProgressPercentage() }}%</span>
        </div>
      </div>

      <div class="order-items">
        <div class="items-header">
          <span class="items-title">Commande</span>
          <span class="items-count">{{ order.items.length }} article(s)</span>
        </div>
        <div *ngFor="let item of order.items; trackBy: trackByItemId" 
             class="order-item bounce-in">
          <div class="item-quantity-wrapper">
            <span class="item-quantity">{{ item.quantity }}</span>
          </div>
          <div class="item-details">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-category" [class]="'category-' + (item.category ? item.category.toLowerCase() : 'inconnue')">
              {{ getCategoryLabel(item.category) }}
            </span>
          </div>
        </div>
      </div>

      <div class="special-notes" *ngIf="order.specialNotes && order.specialNotes.length > 0">
        <div class="notes-header">
          <span class="notes-icon">📝</span>
          <span class="notes-title">Instructions spéciales</span>
        </div>
        <div *ngFor="let note of order.specialNotes; trackBy: trackByNote" 
             class="note-item">
          <span class="note-text">{{ note }}</span>
        </div>
      </div>

      <div class="card-actions">
        <button *ngIf="order.status === 'NOUVELLE'" 
                class="btn btn-commencer glass-effect" 
                (click)="onStatusChange('EN_COURS')">
          <span class="btn-icon">🚀</span>
          <span>Commencer</span>
        </button>
        
        <button *ngIf="order.status === 'EN_COURS'" 
                class="btn btn-pret glass-effect" 
                (click)="onStatusChange('PRETE')">
          <span class="btn-icon">✅</span>
          <span>Prêt à servir</span>
        </button>
        
        <button *ngIf="order.status === 'PRETE'" 
                class="btn btn-servie glass-effect" 
                (click)="onStatusChange('SERVIE')">
          <span class="btn-icon">🍽️</span>
          <span>Servie</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .order-card {
      background: linear-gradient(135deg, 
        rgba(36, 45, 61, 0.95) 0%, 
        rgba(26, 35, 50, 0.95) 100%);
      border-radius: 20px;
      padding: 28px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 
        0 12px 40px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      position: relative;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .order-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--accent-blue), var(--accent-purple));
      border-radius: 20px 20px 0 0;
    }

    .status-theme-nouvelle::before {
      background: linear-gradient(90deg, var(--accent-orange), #ff8c42);
    }

    .status-theme-en_cours::before {
      background: linear-gradient(90deg, var(--accent-blue), #0099cc);
    }

    .status-theme-prete::before {
      background: linear-gradient(90deg, var(--accent-green), #00c853);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }

    .table-info {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .table-number-container {
      position: relative;
      display: inline-block;
    }

    .table-number {
      font-size: 24px;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0;
      position: relative;
      z-index: 2;
    }

    .table-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100px;
      height: 40px;
      background: radial-gradient(ellipse, var(--accent-blue) 0%, transparent 70%);
      opacity: 0.2;
      border-radius: 50%;
    }

    .status-badge-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status-badge {
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      backdrop-filter: blur(10px);
      border: 1px solid;
    }

    .status-badge.status-nouvelle {
      background: rgba(255, 107, 53, 0.2);
      color: var(--accent-orange);
      border-color: var(--accent-orange);
    }

    .status-badge.status-en_cours {
      background: rgba(0, 212, 255, 0.2);
      color: var(--accent-blue);
      border-color: var(--accent-blue);
    }

    .status-badge.status-prete {
      background: rgba(0, 230, 118, 0.2);
      color: var(--accent-green);
      border-color: var(--accent-green);
    }

    .time-display {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .time-icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .time-icon {
      font-size: 18px;
    }

    .time-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .time-value {
      font-size: 20px;
      font-weight: 800;
      color: var(--text-primary);
      display: flex;
      align-items: baseline;
      gap: 2px;
    }

    .time-unit {
      font-size: 12px;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .time-value.time-warning {
      color: var(--accent-red);
      animation: pulse 1.5s infinite;
    }

    .estimated-time {
      font-size: 12px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .progress-section {
      margin-bottom: 24px;
    }

    .progress-bar {
      height: 8px;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 8px;
      background: rgba(255, 255, 255, 0.08);
      position: relative;
    }

    .progress-fill {
      height: 100%;
      transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .progress-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .order-items {
      margin-bottom: 24px;
    }

    .items-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .items-title {
      font-size: 14px;
      font-weight: 700;
      color: var(--text-primary);
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }

    .items-count {
      font-size: 12px;
      color: var(--text-secondary);
      background: rgba(255, 255, 255, 0.05);
      padding: 4px 12px;
      border-radius: 12px;
      font-weight: 600;
    }

    .order-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.03);
      transition: all 0.3s ease;
    }

    .order-item:last-child {
      border-bottom: none;
    }

    .order-item:hover {
      background: rgba(255, 255, 255, 0.02);
      border-radius: 8px;
      padding-left: 8px;
      padding-right: 8px;
    }

    .item-quantity-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
      border-radius: 8px;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(0, 212, 255, 0.3);
    }

    .item-quantity {
      color: white;
      font-size: 14px;
      font-weight: 800;
    }

    .item-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .item-name {
      color: var(--text-primary);
      font-weight: 600;
      font-size: 15px;
    }

    .item-category {
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      align-self: flex-start;
    }

    .category-main { 
      background: linear-gradient(135deg, var(--accent-red), #c62828);
      color: white; 
    }
    .category-appetizer { 
      background: linear-gradient(135deg, #ff9800, #f57c00);
      color: white; 
    }
    .category-dessert { 
      background: linear-gradient(135deg, var(--accent-purple), #8e24aa);
      color: white; 
    }
    .category-drink { 
      background: linear-gradient(135deg, #00bcd4, #0097a7);
      color: white; 
    }

    .special-notes {
      margin-bottom: 24px;
    }

    .notes-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      color: var(--text-secondary);
    }

    .notes-icon {
      font-size: 16px;
    }

    .notes-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }

    .note-item {
      padding: 12px 16px;
      background: rgba(241, 196, 15, 0.1);
      border: 1px solid rgba(241, 196, 15, 0.3);
      border-radius: 12px;
      margin-bottom: 8px;
      color: #f1c40f;
      font-size: 14px;
      font-weight: 500;
      backdrop-filter: blur(10px);
    }

    .note-item:last-child {
      margin-bottom: 0;
    }

    .note-text {
      display: block;
      line-height: 1.4;
    }

    .card-actions {
      margin-top: 24px;
    }

    .card-actions .btn {
      width: 100%;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      font-size: 15px;
      padding: 16px 24px;
    }

    .btn-icon {
      font-size: 18px;
    }

    @media (max-width: 768px) {
      .order-card {
        padding: 20px;
      }

      .card-header {
        flex-direction: column;
        gap: 16px;
      }

      .time-display {
        align-self: flex-end;
      }

      .table-number {
        font-size: 20px;
      }

      .time-value {
        font-size: 18px;
      }
    }
  `]
})
export class OrderCardComponent {
  @Input() order!: Order;
  @Output() statusChange = new EventEmitter<Order>();

  getStatusLabel(status: Order['status']): string {
    switch (status) {
      case 'NOUVELLE': return 'Nouvelle';
      case 'EN_COURS': return 'En cours';
      case 'PRETE': return 'Prête';
      case 'SERVIE': return 'Servie';
      default: return status;
    }
  }

  getCategoryLabel(category: string): string {
    switch (category) {
      case 'MAIN': return 'Plat';
      case 'APPETIZER': return 'Entrée';
      case 'DESSERT': return 'Dessert';
      case 'DRINK': return 'Boisson';
      default: return category;
    }
  }

  getProgressPercentage(): number {
    if (this.order.estimatedTime === 0) return 0;
    return Math.min((this.order.timeElapsed / this.order.estimatedTime) * 100, 100);
  }

  onStatusChange(newStatus: Order['status']): void {
    this.statusChange.emit(this.order);
  }

  trackByItemId(index: number, item: any): string {
    return item.id;
  }

  trackByNote(index: number, note: string): string {
    return note;
  }
} 