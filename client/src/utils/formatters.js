/**
 * Format a timestamp into a relative "time ago" string.
 * e.g. "2h ago", "just now", "3d ago"
 */
export const timeAgo = (timestamp) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
};

/**
 * Format a number in Indian style:
 * 1000 → 1K, 100000 → 1L, 1243 → 1.2K, 124531 → 1,24,531
 */
export const formatCount = (n) => {
  if (n >= 100000) return `${(n / 100000).toFixed(1).replace('.0', '')}L`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace('.0', '')}K`;
  return n.toLocaleString('en-IN');
};

/**
 * Format a large count into Indian-style with comma e.g. 1,24,531
 */
export const formatIndian = (n) => {
  return n.toLocaleString('en-IN');
};

/**
 * Get the label for a severity value
 */
export const SEVERITY_LABELS = {
  minor:  { label: '🟡 Minor Paap',  shortLabel: 'Minor Paap',  cls: 'severity-minor' },
  medium: { label: '🟠 Medium Paap', shortLabel: 'Medium Paap', cls: 'severity-medium' },
  bada:   { label: '🔴 Bada Paap',   shortLabel: 'Bada Paap',   cls: 'severity-bada' },
  maha:   { label: '💀 Mahapaap',    shortLabel: 'Mahapaap',    cls: 'severity-maha' },
};

export const getSeverityInfo = (severity) =>
  SEVERITY_LABELS[severity] || SEVERITY_LABELS['minor'];
