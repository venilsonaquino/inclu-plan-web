export function formatRelativeTime(dateString: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "AGORA";
  if (diffInSeconds < 3600) return `HÁ ${Math.floor(diffInSeconds / 60)} MINUTOS`;
  
  const diffInHours = Math.floor(diffInSeconds / 3600);
  if (diffInHours < 24) {
    if (diffInHours === 0) return "AGORA";
    return `HÁ ${diffInHours} HORAS`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "ONTEM";
  if (diffInDays < 7) return `HÁ ${diffInDays} DIAS`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks === 1) return "HÁ 1 SEMANA";
  if (diffInWeeks < 4) return `HÁ ${diffInWeeks} SEMANAS`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths === 1) return "HÁ 1 MÊS";
  
  return date.toLocaleDateString('pt-BR').toUpperCase();
}
