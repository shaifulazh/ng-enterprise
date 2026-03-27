import { createActionGroup, emptyProps } from '@ngrx/store';

export const LayoutActions = createActionGroup({
  source: 'Layout',
  events: {
    'Toggle Sidebar':        emptyProps(),
    'Collapse Sidebar':      emptyProps(),
    'Expand Sidebar':        emptyProps(),
    'Toggle Mobile Menu':    emptyProps(),
    'Close Mobile Menu':     emptyProps(),
  },
});
