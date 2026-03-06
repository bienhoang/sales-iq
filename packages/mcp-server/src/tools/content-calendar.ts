import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { Config } from '@bienhoang/sales-iq-core';

interface CalendarEntry {
  id: string;
  date: string;
  channel: string;
  content: string;
  status: string;
  createdAt: string;
}

interface CalendarData {
  entries: CalendarEntry[];
  lastUpdated: string;
}

/** Find project root by walking up from CWD for .sales-iq.json */
function findProjectDir(): string | null {
  if (process.env.SALES_IQ_PROJECT_DIR) {
    const envDir = process.env.SALES_IQ_PROJECT_DIR;
    if (existsSync(join(envDir, '.sales-iq.json'))) return envDir;
  }
  let dir = process.cwd();
  while (dir !== dirname(dir)) {
    if (existsSync(join(dir, '.sales-iq.json'))) return dir;
    dir = dirname(dir);
  }
  return null;
}

function getCalendarFilePath(): string | null {
  const projectDir = findProjectDir();
  if (!projectDir) return null;
  return join(projectDir, 'workspace', 'social', 'calendar-entries.json');
}

/** Read entries from disk — returns a fresh array per call (no global state). */
function loadEntries(): CalendarEntry[] {
  try {
    const filePath = getCalendarFilePath();
    if (!filePath || !existsSync(filePath)) return [];
    const raw = readFileSync(filePath, 'utf-8');
    const data: CalendarData = JSON.parse(raw);
    return Array.isArray(data.entries) ? data.entries : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: CalendarEntry[]): { ok: boolean; error?: string } {
  try {
    const filePath = getCalendarFilePath();
    if (!filePath) return { ok: false, error: 'No project directory found' };
    mkdirSync(dirname(filePath), { recursive: true });
    const data: CalendarData = {
      entries,
      lastUpdated: new Date().toISOString(),
    };
    writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return { ok: true };
  } catch (err) {
    const message = (err as Error).message;
    process.stderr.write(`[sales-iq] Failed to save calendar: ${message}\n`);
    return { ok: false, error: message };
  }
}

export const contentCalendarToolDefinitions = [
  {
    name: 'calendar_list_entries',
    description: 'List content calendar entries within a date range',
    inputSchema: {
      type: 'object' as const,
      properties: {
        startDate: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
        endDate: { type: 'string', description: 'End date (YYYY-MM-DD)' },
      },
      required: ['startDate', 'endDate'],
    },
  },
  {
    name: 'calendar_create_entry',
    description: 'Create a new content calendar entry',
    inputSchema: {
      type: 'object' as const,
      properties: {
        date: { type: 'string', description: 'Publish date (YYYY-MM-DD)' },
        channel: { type: 'string', description: 'Distribution channel (e.g. twitter, blog, email)' },
        content: { type: 'string', description: 'Content description or copy' },
        status: { type: 'string', description: 'Entry status (draft, scheduled, published)' },
      },
      required: ['date', 'channel', 'content'],
    },
  },
];

export async function handleContentCalendarTool(
  name: string,
  args: Record<string, unknown>,
  _config: Config,
): Promise<unknown> {
  const entries = loadEntries();

  if (name === 'calendar_list_entries') {
    const { startDate, endDate } = args as { startDate: string; endDate: string };
    const filtered = entries.filter(
      (e) => e.date >= startDate && e.date <= endDate,
    );
    return { entries: filtered, total: filtered.length, range: { startDate, endDate } };
  }

  if (name === 'calendar_create_entry') {
    const { date, channel, content, status = 'draft' } = args as { date: string; channel: string; content: string; status?: string };

    // Validate inputs
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return { success: false, error: 'date must be YYYY-MM-DD format' };
    }
    if (!channel || channel.length > 100) {
      return { success: false, error: 'channel is required (max 100 chars)' };
    }
    if (!content || content.length > 10000) {
      return { success: false, error: 'content is required (max 10000 chars)' };
    }
    const entry: CalendarEntry = { id: `cal-${Date.now()}`, date, channel, content, status, createdAt: new Date().toISOString() };
    entries.push(entry);
    const result = saveEntries(entries);
    if (!result.ok) {
      return { success: false, error: `Failed to persist entry: ${result.error}`, entry };
    }
    return { success: true, entry };
  }

  return null;
}
