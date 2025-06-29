import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, map, switchMap, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Order, KitchenStats } from '../types/order.interface';

@Injectable({
  providedIn: 'root'
})
export class KitchenService {
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  private statsSubject = new BehaviorSubject<KitchenStats>({
    totalActive: 0,
    averageTime: 0,
    systemStatus: 'OFF',
    newOrders: 0,
    inProgress: 0,
    ready: 0
  });

  orders$ = this.ordersSubject.asObservable();
  stats$ = this.statsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.fetchOrders();
    interval(60000).subscribe(() => {
      this.fetchOrders();
    });
  }

  private fetchOrders(): void {
    this.http.get<Order[]>('/api/orders').subscribe({
      next: (orders) => {
        this.ordersSubject.next(orders);
        this.statsSubject.next(this.calculateStats(orders));
      },
      error: (err) => {
        console.error('Failed to fetch orders', err);
        this.ordersSubject.next([]);
        this.statsSubject.next({
          totalActive: 0,
          averageTime: 0,
          systemStatus: 'OFF',
          newOrders: 0,
          inProgress: 0,
          ready: 0
        });
      }
    });
  }

  private calculateStats(orders: Order[]): KitchenStats {
    const activeOrders = orders.filter(o => o.status !== 'SERVIE');
    const averageTime = activeOrders.length > 0 
      ? Math.round(activeOrders.reduce((sum, order) => sum + (order.timeElapsed || 0), 0) / activeOrders.length)
      : 0;

    return {
      totalActive: activeOrders.length,
      averageTime,
      systemStatus: 'ON',
      newOrders: orders.filter(o => o.status === 'NOUVELLE').length,
      inProgress: orders.filter(o => o.status === 'EN_COURS').length,
      ready: orders.filter(o => o.status === 'PRETE').length
    };
  }

  // Returns observable of orders filtered by status, for use in the main app
  // Normalise les statuts pour ignorer les accents et la casse
  private normalizeStatus(status: string): string {
    return status
      .toUpperCase()
      .normalize('NFD') // décompose les accents
      .replace(/[\u0300-\u036f]/g, '') // retire les diacritiques
      .replace('É', 'E')
      .replace('Ê', 'E');
  }

  getFilteredOrders(filter: 'TOUTES' | 'NOUVELLES' | 'EN_COURS' | 'PRETES') {
    return this.orders$.pipe(
      map(orders => {
        switch (filter) {
          case 'NOUVELLES':
            return orders.filter(o => this.normalizeStatus(o.status) === 'NOUVELLE');
          case 'EN_COURS':
            return orders.filter(o => this.normalizeStatus(o.status) === 'EN_COURS');
          case 'PRETES':
            return orders.filter(o => this.normalizeStatus(o.status) === 'PRETE');
          default:
            return orders.filter(o => this.normalizeStatus(o.status) !== 'SERVIE');
        }
      })
    );
  }

  // Met à jour le statut d'une commande via le backend
  updateOrderStatus(orderId: string, newStatus: 'NOUVELLE' | 'EN_COURS' | 'PRETE' | 'SERVIE'): void {
    this.http.patch<Order>(`/api/orders/${orderId}/status`, { status: newStatus }).subscribe({
      next: (updatedOrder) => {
        // Après mise à jour, on rafraîchit la liste depuis le backend
        this.fetchOrders();
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du statut', err);
      }
    });
  }
}