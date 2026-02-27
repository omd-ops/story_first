#!/usr/bin/env node
// One-shot script: POSTs /api/reminders/sendDue and logs the response.
// Use in system cron: run every 5 minutes for testing.

const TARGET = process.env.TARGET_URL || 'http://localhost:3000/api/reminders/sendDue';

async function main() {
  try {
    const res = await fetch(TARGET, { method: 'POST' });
    const text = await res.text();
    console.log(new Date().toISOString(), res.status, text);
    process.exit(res.ok ? 0 : 1);
  } catch (err) {
    console.error(new Date().toISOString(), 'error', err);
    process.exit(2);
  }
}

main();
