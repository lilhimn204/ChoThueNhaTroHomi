/**
 * Export data as a CSV file with UTF-8 BOM for Excel compatibility.
 *
 * @example
 * exportCsv({
 *   filename: "homi-rooms",
 *   headers: ["Tiêu đề", "Giá", "Trạng thái"],
 *   rows: [["Phòng A", "4.500.000", "Còn phòng"]],
 * });
 */
export function exportCsv({
  filename,
  headers,
  rows,
}: {
  filename: string;
  headers: string[];
  rows: string[][];
}) {
  const today = new Date().toISOString().slice(0, 10);
  const fullFilename = `${filename}-${today}.csv`;

  const escapeCell = (value: string) => {
    const escaped = value.replace(/"/g, '""');

    if (/[",\n\r]/.test(escaped)) {
      return `"${escaped}"`;
    }

    return escaped;
  };

  const csvLines = [
    headers.map(escapeCell).join(","),
    ...rows.map((row) => row.map(escapeCell).join(",")),
  ];

  // UTF-8 BOM so Excel recognises Vietnamese characters
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvLines.join("\r\n")], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fullFilename;
  anchor.click();
  URL.revokeObjectURL(url);
}
