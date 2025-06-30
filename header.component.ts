import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, interval, map, startWith } from 'rxjs';
import { KitchenService } from '../../services/kitchen.service';
import { KitchenStats } from '../../types/order.interface';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header glass-effect">
      <div class="header-left">
        <div class="header-title">
          <div class="header-icon-container">
            <span class="header-icon">🍳</span>
            <div class="icon-glow"></div>
          </div>
          <div class="title-content">
            <h1 class="main-title">Écran Cuisine</h1>
            <p class="header-subtitle">Gestion des commandes en temps réel</p>
          </div>
        </div>
      </div>
      
      <div class="header-stats" *ngIf="stats$ | async as stats">
        <div class="stat-item glass-effect bounce-in">
          <div class="stat-icon-wrapper">
            <span class="stat-icon">📊</span>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.totalActive }}</span>
            <span class="stat-label">Commandes Actives</span>
          </div>
        </div>
        
        <div class="stat-item glass-effect bounce-in">
          <div class="stat-icon-wrapper">
            <span class="stat-icon">⏱️</span>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ getAverageTime(stats.averageTime) }}<span class="unit">min</span></span>
            <span class="stat-label">Temps Moyen</span>
          </div>
        </div>
        
        <div class="stat-item status-indicator glass-effect bounce-in" 
             [class]="'status-' + stats.systemStatus.toLowerCase()">
          <div class="stat-icon-wrapper">
            <span class="status-dot" [class]="stats.systemStatus.toLowerCase()"></span>
            <span class="stat-icon">🟢</span>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.systemStatus }}</span>
            <span class="stat-label">Statut Système</span>
          </div>
        </div>
      </div>
      
      <div class="header-time glass-effect">
        <div class="time-container">
          <div class="date-time-display">
            <span class="current-time">{{ currentTime$ | async }}</span>
            <span class="current-date">{{ currentDate$ | async }}</span>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 32px 40px;
      background: linear-gradient(135deg, 
        rgba(26, 35, 50, 0.95) 0%, 
        rgba(52, 73, 94, 0.95) 100%);
      border-bottom: 1px solid rgba(0, 212, 255, 0.3);
      box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      position: relative;
      z-index: 10;
    }

    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, 
        var(--accent-orange), 
        var(--accent-blue), 
        var(--accent-green), 
        var(--accent-purple));
    }

    .header-left {
      display: flex;
      align-items: center;
    }

    .header-title {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .header-icon-container {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .header-icon {
      font-size: 40px;
      z-index: 2;
      position: relative;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
    }

    .icon-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 60px;
      height: 60px;
      background: radial-gradient(circle, var(--accent-orange) 0%, transparent 70%);
      border-radius: 50%;
      opacity: 0.3;
      animation: glow-pulse 3s ease-in-out infinite;
    }

    @keyframes glow-pulse {
      0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
      50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.6; }
    }

    .title-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .main-title {
      font-size: 32px;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
      background: linear-gradient(135deg, #ffffff, #e3f2fd);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .header-subtitle {
      color: var(--text-secondary);
      font-size: 14px;
      margin: 0;
      font-weight: 500;
      opacity: 0.9;
    }

    .header-stats {
      display: flex;
      gap: 24px;
      align-items: center;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px 24px;
      border-radius: 16px;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      min-width: 160px;
    }

    .stat-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      transition: left 0.6s;
    }

    .stat-item:hover::before {
      left: 100%;
    }

    .stat-item:hover {
      transform: translateY(-4px) scale(1.05);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
    }

    .stat-icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      position: relative;
    }

    .stat-icon {
      font-size: 20px;
      z-index: 2;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 800;
      color: var(--text-primary);
      line-height: 1;
      display: flex;
      align-items: baseline;
      gap: 4px;
    }

    .unit {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .stat-label {
      font-size: 12px;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
    }

    .status-indicator.status-on {
      background: linear-gradient(135deg, 
        rgba(0, 230, 118, 0.2), 
        rgba(0, 200, 83, 0.2));
      border: 1px solid rgba(0, 230, 118, 0.3);
    }

    .status-indicator.status-off {
      background: linear-gradient(135deg, 
        rgba(255, 82, 82, 0.2), 
        rgba(192, 57, 43, 0.2));
      border: 1px solid rgba(255, 82, 82, 0.3);
    }

    .header-time {
      padding: 20px 24px;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      position: relative;
      overflow: hidden;
    }

    .time-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .date-time-display {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .current-time {
      font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
      font-size: 36px;
      font-weight: 900;
      color: #ffffff;
      text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      letter-spacing: 2px;
    }

    .current-date {
      font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
      font-size: 16px;
      font-weight: 700;
      color: #ffffff;
      text-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      opacity: 0.7;
    }

    @media (max-width: 1024px) {
      .header {
        flex-direction: column;
        gap: 24px;
        padding: 24px;
      }

      .header-stats {
        gap: 16px;
        flex-wrap: wrap;
        justify-content: center;
      }

      .stat-item {
        min-width: 140px;
        padding: 16px 20px;
      }

      .current-time {
        font-size: 30px;
      }

      .current-date {
        font-size: 14px;
      }
    }

    @media (max-width: 768px) {
      .header-title {
        flex-direction: column;
        gap: 12px;
        text-align: center;
      }

      .main-title {
        font-size: 28px;
      }

      .stat-item {
        flex-direction: column;
        text-align: center;
        gap: 12px;
        min-width: 120px;
      }

      .stat-content {
        align-items: center;
      }

      .current-time {
        font-size: 24px;
      }

      .current-date {
        font-size: 12px;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  stats$: Observable<KitchenStats>;
  currentTime$: Observable<string>;
  currentDate$: Observable<string>;

  constructor(private kitchenService: KitchenService) {
    this.stats$ = this.kitchenService.stats$;
    this.currentTime$ = interval(1000).pipe(
      startWith(0),
      map(() => {
        const date = new Date();
        const options: Intl.DateTimeFormatOptions = {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        };
        return date.toLocaleString('fr-FR', options);
      })
    );
    this.currentDate$ = interval(1000).pipe(
      startWith(0),
      map(() => {
        const date = new Date();
        const options: Intl.DateTimeFormatOptions = {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        };
        return date.toLocaleString('fr-FR', options).replace(/, /g, ' ');
      })
    );
  }

  ngOnInit(): void {
    // Detailed debug logging
    this.stats$.subscribe(stats => {
      console.log('Kitchen Stats at', new Date().toLocaleString('fr-FR'), ':', stats);
      console.log('Raw Average Time:', stats.averageTime, 'minutes (raw)');
      const expectedAverage = 35; // Based on (18 + 12 + 5) / 3
      if (stats.averageTime > expectedAverage * 2) { // Warn if more than double the expected average
        console.warn('Average time', stats.averageTime, 'min is illogical for 18, 12, 5 min orders');
      }
    });
  }

  // Affiche le temps moyen en minutes, sans correction ni cap, car la donnée est déjà en minutes (voir Order interface)
  getAverageTime(rawTime: number): number {
    if (rawTime < 0 || isNaN(rawTime)) {
      return 0;
    }
    return Math.round(rawTime); // la donnée est supposée en minutes
  }
}