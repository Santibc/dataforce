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

export const SEVERITY_LABEL_MAP: Record<string, string> = Object.fromEntries(
  SEVERITY_OPTIONS.map((o) => [o.value, o.label])
);

export const prettifySlug = (slug: string): string =>
  slug
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
