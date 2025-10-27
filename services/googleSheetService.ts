import { PatientRecord } from '../types';

// IMPORTANT: Replace this placeholder with the Web App URL you get from deploying the Google Apps Script.
// See INSTRUCTIONS.md for a detailed guide.
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwyeloSNVs--3uMy3qoWx35BRg4JO4isEE9fle8UTQNyFzd6ULL2c81DJoZE3NbMCekjw/exec';

export const fetchRecords = async (): Promise<PatientRecord[]> => {
  const response = await fetch(SCRIPT_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch records from Google Sheet.');
  }
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.message || 'An error occurred in the Google Apps Script while fetching.');
  }
  return result.data as PatientRecord[];
};

export const saveRecord = async (record: PatientRecord): Promise<PatientRecord> => {
  const response = await fetch(SCRIPT_URL, {
    method: 'POST',
    mode: 'cors',
    headers: {
      // Changed to text/plain to avoid Google Apps Script's CORS/redirect issues with JSON POST requests.
      'Content-Type': 'text/plain',
    },
    body: JSON.stringify(record),
  });

  if (!response.ok) {
    throw new Error('Failed to save record to Google Sheet.');
  }
   const result = await response.json();
    if (!result.success) {
    throw new Error(result.message || 'An error occurred in the Google Apps Script while saving.');
  }
  return result.data as PatientRecord;
};