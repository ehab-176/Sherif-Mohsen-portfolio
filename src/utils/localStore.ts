import type { ContactSubmissionInput } from './studioLogic';

// This is a development-only inbox stored on the same browser/device.
// It does not deliver messages to the website owner or work across devices.
const INQUIRIES_KEY = 'sherif_mohsen_local_inquiries_v1';

export interface LocalInquiry extends ContactSubmissionInput {
  id: string;
  createdAt: string;
}

export function listLocalInquiries(): LocalInquiry[] {
  try {
    const raw = localStorage.getItem(INQUIRIES_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as LocalInquiry[]).reverse() : [];
  } catch {
    return [];
  }
}

export function saveLocalInquiry(input: ContactSubmissionInput): LocalInquiry {
  const entry: LocalInquiry = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  const current = listLocalInquiries().reverse();
  localStorage.setItem(INQUIRIES_KEY, JSON.stringify([...current, entry]));
  return entry;
}
