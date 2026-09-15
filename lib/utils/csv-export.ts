export type CsvColumn<T> = {
  label: string;
  value: (row: T) => string | number | null | undefined;
};

function escapeCsvCell(value: string | number | null | undefined): string {
  const text = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function buildCsv<T>(rows: T[], columns: CsvColumn<T>[]): string {
  const header = columns.map((c) => escapeCsvCell(c.label)).join(",");
  const body = rows
    .map((row) => columns.map((c) => escapeCsvCell(c.value(row))).join(","))
    .join("\n");
  return `${header}\n${body}`;
}

export function downloadCsv(filename: string, csvContent: string): void {
  // Prefix with a UTF-8 BOM so Excel renders special characters (e.g. ₦) correctly.
  const blob = new Blob(["﻿" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToCsv<T>(filename: string, rows: T[], columns: CsvColumn<T>[]): void {
  downloadCsv(filename, buildCsv(rows, columns));
}
