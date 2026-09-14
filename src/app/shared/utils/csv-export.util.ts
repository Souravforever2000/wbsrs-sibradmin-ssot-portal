/**
 * Converts an array of flat objects into a CSV file and triggers a browser
 * download. Handles comma/quote/newline escaping per RFC 4180, and prefixes
 * a UTF-8 BOM so Excel renders non-ASCII district names correctly instead
 * of mangling them.
 */
export function downloadCsv(filename: string, rows: Record<string, unknown>[]): void {
  if (!rows.length) {
    return;
  }

  const headers = Object.keys(rows[0]);

  const escapeCell = (value: unknown): string => {
    const str = value === null || value === undefined ? '' : String(value);
    if (/[",\n]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const lines = [
    headers.join(','),
    ...rows.map((row) => headers.map((h) => escapeCell(row[h])).join(',')),
  ];

  const csvContent = lines.join('\r\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}