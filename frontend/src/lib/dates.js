export function daysUntil(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.round((d - now) / 86400000);
}

export function expiryStatus(days) {
  if (days === null) return 'ok';
  if (days <= 1) return 'bad';
  if (days <= 4) return 'warn';
  return 'ok';
}

export function expiryLabel(days) {
  if (days === null) return 'no date';
  if (days < 0) return `expired ${-days}d ago`;
  if (days === 0) return 'expires today';
  if (days === 1) return '1 day left';
  return `${days} days left`;
}
