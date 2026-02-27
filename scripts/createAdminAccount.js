#!/usr/bin/env node

const readline = require('readline/promises');
const { stdin, stdout } = require('process');
const { createClient } = require('@supabase/supabase-js');

function getEnv(name) {
  return (process.env[name] || '').trim();
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validatePassword(value) {
  return typeof value === 'string' && value.length >= 8;
}

async function promptForMissing(emailArg, passwordArg) {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  try {
    let email = (emailArg || '').trim();
    let password = (passwordArg || '').trim();

    while (!validateEmail(email)) {
      email = (await rl.question('Admin email: ')).trim();
      if (!validateEmail(email)) {
        console.log('Please enter a valid email address.');
      }
    }

    while (!validatePassword(password)) {
      password = (await rl.question('Admin password (min 8 chars): ')).trim();
      if (!validatePassword(password)) {
        console.log('Password must be at least 8 characters.');
      }
    }

    return { email, password };
  } finally {
    rl.close();
  }
}

async function ensurePublicUserProfile(supabaseAdmin, user, email) {
  const nowIso = new Date().toISOString();
  const nameFromEmail = (email.split('@')[0] || 'Admin').replace(/[._-]+/g, ' ').trim();
  const displayName = nameFromEmail ? `${nameFromEmail} (Admin)` : 'Admin';

  const payload = {
    id: user.id,
    email,
    name: displayName,
    display_name: displayName,
    status: 'approved',
    updated_at: nowIso,
  };

  const { error } = await supabaseAdmin
    .from('users')
    .upsert(payload, { onConflict: 'id' });

  if (error) {
    throw new Error(`Failed to upsert public.users profile: ${error.message}`);
  }
}

async function createAdminAccount(email, password) {
  const supabaseUrl = getEnv('SUPABASE_URL') || getEnv('NEXT_PUBLIC_SUPABASE_URL');
  const serviceRoleKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing env vars. Required: SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL), SUPABASE_SERVICE_ROLE_KEY');
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: 'admin', is_admin: true },
  });

  if (error) {
    const code = error.status || error.code || 'unknown';
    throw new Error(`Failed to create auth user (${code}): ${error.message}`);
  }

  const user = data.user;
  if (!user || !user.id) {
    throw new Error('Auth user creation returned no user id.');
  }

  await ensurePublicUserProfile(supabaseAdmin, user, email);

  return user;
}

async function main() {
  try {
    const emailArg = process.argv[2];
    const passwordArg = process.argv[3];
    const { email, password } = await promptForMissing(emailArg, passwordArg);

    const user = await createAdminAccount(email, password);

    console.log('Admin account created successfully.');
    console.log(`User ID: ${user.id}`);
    console.log(`Email: ${email}`);
    console.log('Login URL: /auth/login');
    console.log('Post-login redirect: /admin');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`createAdminAccount failed: ${message}`);
    process.exit(1);
  }
}

main();
