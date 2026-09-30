import { google, sheets_v4 } from 'googleapis';

export interface GoogleSheetsConfig {
  spreadsheetId: string;
  clientEmail: string;
  privateKey: string;
  range?: string;
}

export function getGoogleSheetsConfig(): GoogleSheetsConfig | null {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!spreadsheetId || !clientEmail || !privateKey) {
    return null;
  }

  // Handle newlines and escaped quotation characters
  privateKey = privateKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n');

  return {
    spreadsheetId,
    clientEmail,
    privateKey,
    range: process.env.GOOGLE_SHEET_RANGE || 'A1:Z',
  };
}

export function createGoogleSheetsClient(config: GoogleSheetsConfig): sheets_v4.Sheets {
  const auth = new google.auth.JWT({
    email: config.clientEmail,
    key: config.privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  return google.sheets({ version: 'v4', auth });
}
