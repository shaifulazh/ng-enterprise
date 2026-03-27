import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { StatCard, ActivityItem } from '../store/dashboard.state';
import { environment } from '@env/environment';

@Injectable()
export class DashboardApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/dashboard`;

  getStats(): Observable<StatCard[]> {
    // Replace with: return this.http.get<StatCard[]>(`${this.base}/stats`);
    return of(MOCK_STATS).pipe(delay(600));
  }

  getActivity(): Observable<ActivityItem[]> {
    // Replace with: return this.http.get<ActivityItem[]>(`${this.base}/activity`);
    return of(MOCK_ACTIVITY).pipe(delay(800));
  }
}

const MOCK_STATS: StatCard[] = [
  { id: '1', label: 'Total Revenue',    value: 'RM 284,500', change: 12.5, trend: 'up'   },
  { id: '2', label: 'Active Users',     value: '4,821',      change: 8.2,  trend: 'up'   },
  { id: '3', label: 'Open Tickets',     value: '142',        change: -3.1, trend: 'down' },
  { id: '4', label: 'Conversion Rate',  value: '3.84%',      change: 0.2,  trend: 'flat' },
];

const MOCK_ACTIVITY: ActivityItem[] = [
  { id: '1', user: 'Ahmad Razif',   action: 'created',  target: 'Invoice #1042',    timestamp: '2 min ago',  avatar: 'AR' },
  { id: '2', user: 'Nurul Ain',     action: 'approved', target: 'Purchase Order',   timestamp: '14 min ago', avatar: 'NA' },
  { id: '3', user: 'Wei Liang',     action: 'updated',  target: 'Module B config',  timestamp: '1 hr ago',   avatar: 'WL' },
  { id: '4', user: 'Priya Nair',    action: 'deleted',  target: 'Draft Report',     timestamp: '3 hr ago',   avatar: 'PN' },
  { id: '5', user: 'Faizal Haris',  action: 'exported', target: 'Q2 Analytics CSV', timestamp: 'Yesterday',  avatar: 'FH' },
];
