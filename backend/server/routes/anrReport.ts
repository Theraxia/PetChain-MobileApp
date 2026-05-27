import { randomUUID } from 'crypto';

import express from 'express';

import { query } from '../../src/db';

const router = express.Router();

router.post('/anr-report', async (req, res) => {
  const payload = req.body;
  if (!payload || !payload.platform || !payload.type || !payload.stackTrace) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  try {
    const id = randomUUID();
    await query(
      `INSERT INTO anr_reports (id, platform, type, timestamp, thread_name, stack_trace, app_version, os_version, device_model, additional_info, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())`,
      [
        id,
        payload.platform,
        payload.type,
        payload.timestamp || new Date().toISOString(),
        payload.threadName || 'main',
        payload.stackTrace,
        payload.appVersion || null,
        payload.osVersion || null,
        payload.deviceModel || null,
        payload.additionalInfo ? JSON.stringify(payload.additionalInfo) : null,
      ],
    );

    return res.status(201).json({ status: 'ok' });
  } catch (err) {
    console.error('Failed to save ANR report', err);
    return res.status(500).json({ error: 'failed to save report' });
  }
});

export default router;
