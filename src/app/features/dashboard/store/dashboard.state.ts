export interface StatCard {
  id:      string;
  label:   string;
  value:   string;
  change:  number;  // percent, positive = up
  trend:   'up' | 'down' | 'flat';
}

export interface ActivityItem {
  id:        string;
  user:      string;
  action:    string;
  target:    string;
  timestamp: string;
  avatar:    string;
}

export interface DashboardState {
  stats:     StatCard[];
  activity:  ActivityItem[];
  loading:   boolean;
  error:     string | null;
}

export const initialDashboardState: DashboardState = {
  stats:    [],
  activity: [],
  loading:  false,
  error:    null,
};
