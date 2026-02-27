export function getScoreClass(score: number): string {
  if (score >= 80) return 'score-hot';
  if (score >= 50) return 'score-warm';
  return 'score-cold';
}

export function getClassificationLabel(classification: string): string {
  const labels: Record<string, string> = {
    quente: 'Quente',
    morno: 'Morno',
    frio: 'Frio',
  };
  return labels[classification] ?? classification;
}

export function getClassificationBadgeClass(classification: string): string {
  const classes: Record<string, string> = {
    quente: 'badge-hot',
    morno: 'badge-warm',
    frio: 'badge-cold',
  };
  return classes[classification] ?? '';
}
