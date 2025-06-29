import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

import { HeaderComponent } from './components/header/header.component';
import { FilterTabsComponent, FilterType } from './components/filter-tabs/filter-tabs.component';
import { OrderCardComponent } from './components/order-card/order-card.component';
import { KitchenService } from './services/kitchen.service';
import { Order, KitchenStats } from './types/order.interface';
import { appConfig } from './app/app.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FilterTabsComponent,
    OrderCardComponent,
    HttpClientModule
  ],
  template: `
    <div class="kitchen-container">
      <app-header></app-header>
      
      <app-filter-tabs
        [activeFilter]="activeFilter"
        [stats]="(stats$ | async) || {}"
        (filterChange)="onFilterChange($event)">
      </app-filter-tabs>
      
      <main class="main-content">
        <div class="content-wrapper">
          <div class="order-grid" *ngIf="filteredOrders$ | async as orders; else noOrders">
            <app-order-card
              *ngFor="let order of orders; trackBy: trackByOrderId"
              [order]="order"
              (statusChange)="onStatusChange($event)">
            </app-order-card>
          </div>
          
          <ng-template #noOrders>
            <div class="no-orders glass-effect">
              <div class="no-orders-animation">
                <div class="no-orders-icon">📋</div>
                <div class="pulse-ring"></div>
              </div>
              <div class="no-orders-content">
                <h3>Aucune commande</h3>
                <p>Aucune commande ne correspond à ce filtre pour le moment.</p>
                <div class="no-orders-suggestion">
                  <span>Vérifiez les autres onglets ou attendez de nouvelles commandes</span>
                </div>
              </div>
            </div>
          </ng-template>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .main-content {
      padding: 32px 40px;
      min-height: calc(100vh - 300px);
      position: relative;
    }

    .content-wrapper {
      max-width: 1600px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    .order-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
      gap: 28px;
      animation: fadeIn 0.6s ease-out;
    }

    .no-orders {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 40px;
      text-align: center;
      border-radius: 24px;
      margin: 40px auto;
      max-width: 600px;
      position: relative;
      overflow: hidden;
    }

    .no-orders-animation {
      position: relative;
      margin-bottom: 32px;
    }

    .no-orders-icon {
      font-size: 80px;
      opacity: 0.6;
      position: relative;
      z-index: 2;
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }

    .pulse-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 120px;
      height: 120px;
      border: 2px solid var(--accent-blue);
      border-radius: 50%;
      opacity: 0;
      animation: pulse-ring 2s infinite;
    }

    @keyframes pulse-ring {
      0% {
        transform: translate(-50%, -50%) scale(0.8);
        opacity: 1;
      }
      100% {
        transform: translate(-50%, -50%) scale(1.4);
        opacity: 0;
      }
    }

    .no-orders-content {
      color: var(--text-secondary);
    }

    .no-orders h3 {
      font-size: 28px;
      margin: 0 0 16px 0;
      color: var(--text-primary);
      font-weight: 700;
    }

    .no-orders p {
      font-size: 16px;
      margin: 0 0 24px 0;
      max-width: 400px;
      line-height: 1.6;
      color: var(--text-secondary);
    }

    .no-orders-suggestion {
      padding: 16px 24px;
      background: rgba(0, 212, 255, 0.1);
      border: 1px solid rgba(0, 212, 255, 0.2);
      border-radius: 12px;
      color: var(--accent-blue);
      font-size: 14px;
      font-weight: 500;
      backdrop-filter: blur(10px);
    }

    @media (max-width: 1200px) {
      .order-grid {
        grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
        gap: 24px;
      }
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 20px 16px;
      }

      .order-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .no-orders {
        padding: 60px 20px;
        margin: 20px auto;
      }

      .no-orders-icon {
        font-size: 64px;
      }

      .no-orders h3 {
        font-size: 24px;
      }

      .no-orders p {
        font-size: 14px;
      }
    }

    @media (min-width: 1600px) {
      .order-grid {
        grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
        gap: 32px;
      }
    }
  `]
})
export class App implements OnInit {
  activeFilter: FilterType = 'TOUTES';
  filteredOrders$: Observable<Order[]>;
  stats$: Observable<KitchenStats>;

  constructor(private kitchenService: KitchenService) {
    this.filteredOrders$ = this.kitchenService.getFilteredOrders(this.activeFilter);
    this.stats$ = this.kitchenService.stats$;
  }

  ngOnInit(): void {}

  onFilterChange(filter: FilterType): void {
    this.activeFilter = filter;
    this.filteredOrders$ = this.kitchenService.getFilteredOrders(filter);
  }

  onStatusChange(order: Order): void {
    this.kitchenService.updateOrderStatus(order.id, order.status);
  }

  trackByOrderId(index: number, order: Order): string {
    return order.id;
  }
}

bootstrapApplication(App, appConfig);