
import { PatientRecord } from '../types';

export const exportToCSV = (data: PatientRecord[], filename: string): void => {
  if (data.length === 0) {
    alert("No data to export.");
    return;
  }

  const headers = ['Timestamp', 'Patient Name', 'Age', 'Date', 'Treatment', 'Follow-up Date', 'Instructions', 'Session'];
  const csvRows = [headers.join(',')];

  const escapeCSV = (field: string | null | undefined): string => {
    if (field === null || field === undefined) return '""';
    const str = String(field);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return `"${str}"`;
  };

  data.forEach(record => {
    const row = [
      escapeCSV(record.timestamp),
      escapeCSV(record.patientName),
      escapeCSV(record.age),
      escapeCSV(record.date),
      escapeCSV(record.treatment),
      escapeCSV(record.followUpDate),
      escapeCSV(record.instructions),
      escapeCSV(record.session),
    ];
    csvRows.push(row.join(','));
  });

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
