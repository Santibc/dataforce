export const EVENT_TYPE_OPTIONS = [
  { value: 'absence', label: 'Absence' },
  { value: 'no_call_no_show', label: 'No Call No Show' },
  { value: 'late_arrival', label: 'Late Arrival' },
  { value: 'uniform', label: 'Uniform' },
  { value: 'coaching', label: 'Coaching' },
  { value: 'suspension', label: 'Suspension' },
  { value: 'other', label: 'Other' },
] as const;

export const SEVERITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
] as const;

export const SEVERITY_COLOR_MAP: Record<string, 'success' | 'warning' | 'error'> = {
  low: 'success',
  medium: 'warning',
  high: 'error',
};

export const STATUS_COLOR_MAP: Record<string, 'default' | 'info'> = {
  draft: 'default',
  submitted: 'info',
};

export const EVENT_TYPE_LABEL_MAP: Record<string, string> = Object.fromEntries(
  EVENT_TYPE_OPTIONS.map((o) => [o.value, o.label])
);

export const SEVERITY_LABEL_MAP: Record<string, string> = Object.fromEntries(
  SEVERITY_OPTIONS.map((o) => [o.value, o.label])
);
