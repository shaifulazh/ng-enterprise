// layout.state.ts
export interface LayoutState {
  sidebarCollapsed: boolean;
  mobileMenuOpen:   boolean;
}

export const initialLayoutState: LayoutState = {
  sidebarCollapsed: false,
  mobileMenuOpen:   false,
};
