import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type FilterType = 'TOUTES' | 'NOUVELLES' | 'EN_COURS' | 'PRETES';

@Component({
  selector: 'app-filter-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="filter-tabs-container">
      <div class="filter-tabs">
        <button 
          *ngFor="let tab of tabs; trackBy: trackByKey" 
          class="filter-tab glass-effect"
          [class.active]="tab.key === activeFilter"
          (click)="onFilterChange(tab.key)">
          <div class="tab-icon-wrapper">
            <span class="tab-icon">{{ tab.icon }}</span>
            <div class="icon-bg" [class]="'bg-' + tab.key.toLowerCase()"></div>
          </div>
          <div class="tab-content">
            <span class="tab-label">{{ tab.label }}</span>
            <span class="tab-count" *ngIf="tab.count > 0">{{ tab.count }}</span>
          </div>
          <div class="tab-indicator" [class]="'indicator-' + tab.key.toLowerCase()"></div>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .filter-tabs-container {
      background: linear-gradient(135deg, 
        rgba(15, 20, 25, 0.95) 0%, 
        rgba(26, 35, 50, 0.95) 100%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding: 24px 40px;
      position: relative;
      overflow: hidden;
    }

    .filter-tabs-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 25% 25%, rgba(0, 212, 255, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, rgba(255, 107, 53, 0.05) 0%, transparent 50%);
      pointer-events: none;
    }

    .filter-tabs {
      display: flex;
      gap: 16px;
      position: relative;
      z-index: 2;
      max-width: 1400px;
      margin: 0 auto;
    }

    .filter-tab {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 18px 24px;
      border-radius: 16px;
      color: var(--text-secondary);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      text-transform: uppercase;
      letter-spacing: 0.8px;
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.08);
      min-width: 160px;
    }

    .filter-tab::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      transition: left 0.6s;
    }

    .filter-tab:hover::before {
      left: 100%;
    }

    .filter-tab:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .filter-tab.active {
      color: var(--text-primary);
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    .filter-tab.active[class*="TOUTES"] {
      background: linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(171, 71, 188, 0.2));
      border-color: var(--accent-blue);
    }

    .filter-tab.active[class*="NOUVELLES"] {
      background: linear-gradient(135deg, rgba(255, 107, 53, 0.2), rgba(255, 140, 66, 0.2));
      border-color: var(--accent-orange);
    }

    .filter-tab.active[class*="EN_COURS"] {
      background: linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(0, 153, 204, 0.2));
      border-color: var(--accent-blue);
    }

    .filter-tab.active[class*="PRETES"] {
      background: linear-gradient(135deg, rgba(0, 230, 118, 0.2), rgba(0, 200, 83, 0.2));
      border-color: var(--accent-green);
    }

    .tab-icon-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.05);
    }

    .tab-icon {
      font-size: 18px;
      z-index: 2;
      position: relative;
    }

    .icon-bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: inherit;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .filter-tab.active .icon-bg {
      opacity: 0.3;
    }

    .bg-toutes { background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple)); }
    .bg-nouvelles { background: linear-gradient(135deg, var(--accent-orange), #ff8c42); }
    .bg-en_cours { background: linear-gradient(135deg, var(--accent-blue), #0099cc); }
    .bg-pretes { background: linear-gradient(135deg, var(--accent-green), #00c853); }

    .tab-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
    }

    .tab-label {
      font-weight: 700;
      line-height: 1;
    }

    .tab-count {
      background: rgba(255, 255, 255, 0.15);
      color: var(--text-primary);
      border-radius: 12px;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 800;
      min-width: 24px;
      text-align: center;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      align-self: flex-start;
    }

    .filter-tab.active .tab-count {
      background: rgba(255, 255, 255, 0.25);
      border-color: rgba(255, 255, 255, 0.3);
    }

    .tab-indicator {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      border-radius: 3px 3px 0 0;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .filter-tab.active .tab-indicator {
      opacity: 1;
    }

    .indicator-toutes { background: linear-gradient(90deg, var(--accent-blue), var(--accent-purple)); }
    .indicator-nouvelles { background: var(--accent-orange); }
    .indicator-en_cours { background: var(--accent-blue); }
    .indicator-pretes { background: var(--accent-green); }

    @media (max-width: 1024px) {
      .filter-tabs-container {
        padding: 20px 24px;
      }

      .filter-tabs {
        gap: 12px;
      }

      .filter-tab {
        min-width: 140px;
        padding: 16px 20px;
      }
    }

    @media (max-width: 768px) {
      .filter-tabs-container {
        padding: 16px;
      }

      .filter-tabs {
        gap: 8px;
        overflow-x: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
        padding-bottom: 8px;
      }

      .filter-tabs::-webkit-scrollbar {
        display: none;
      }

      .filter-tab {
        padding: 14px 18px;
        white-space: nowrap;
        flex-shrink: 0;
        min-width: 120px;
      }

      .tab-icon-wrapper {
        width: 36px;
        height: 36px;
      }

      .tab-icon {
        font-size: 16px;
      }
    }
  `]
})
export class FilterTabsComponent {
  @Input() activeFilter: FilterType = 'TOUTES';
  @Input() stats: any = {};
  @Output() filterChange = new EventEmitter<FilterType>();

  tabs = [
    { key: 'TOUTES' as FilterType, label: 'Toutes', icon: '🔄', count: 0 },
    { key: 'NOUVELLES' as FilterType, label: 'Nouvelles', icon: '➕', count: 0 },
    { key: 'EN_COURS' as FilterType, label: 'En cours', icon: '⏳', count: 0 },
    { key: 'PRETES' as FilterType, label: 'Prêtes', icon: '✅', count: 0 }
  ];

  ngOnChanges(): void {
    if (this.stats) {
      this.tabs[0].count = this.stats.totalActive || 0;
      this.tabs[1].count = this.stats.newOrders || 0;
      this.tabs[2].count = this.stats.inProgress || 0;
      this.tabs[3].count = this.stats.ready || 0;
    }
  }

  onFilterChange(filter: FilterType): void {
    this.filterChange.emit(filter);
  }

  trackByKey(index: number, tab: any): string {
    return tab.key;
  }
}