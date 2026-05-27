import config from '../config';

export interface AnrReportPayload {
  platform: 'android' | 'ios';
  type: 'anr' | 'hang';
  timestamp?: string;
  threadName?: string;
  stackTrace: string;
  appVersion?: string;
  osVersion?: string;
  deviceModel?: string;
  additionalInfo?: Record<string, unknown>;
}

export async function sendAnrReport(payload: AnrReportPayload): Promise<boolean> {
  try {
    const res = await fetch(`${config.api.baseUrl}/monitoring/anr-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    return res.ok;
  } catch (err) {
    // swallow errors to avoid crashing the app when reporting fails
    console.warn('Failed to send ANR report', err);
    return false;
  }
}

export default { sendAnrReport };
