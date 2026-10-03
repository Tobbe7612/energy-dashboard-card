export function formatTimeLabelWithFormatter(
  formatter: Intl.DateTimeFormat,
  date: Date,
): string {
  return formatter.format(date);
}

export function formatIntervalWithFormatter(
  formatter: Intl.DateTimeFormat,
  start: string,
  end: string,
): string {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (
    Number.isNaN(startDate.getTime()) ||
    Number.isNaN(endDate.getTime())
  ) {
    return "—";
  }

  return `${formatter.format(startDate)}–${formatter.format(endDate)}`;
}
