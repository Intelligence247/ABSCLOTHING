import mongoose from 'mongoose';
import dns from 'node:dns';
import dnsPromises from 'node:dns/promises';

/**
 * Fixes common .env mistakes: wrapping quotes, trailing spaces/newlines.
 * Does not log the URI (secrets).
 */
const normalizeMongoUri = (raw) => {
  if (raw == null || typeof raw !== 'string') return '';
  let uri = raw.trim();
  if (
    (uri.startsWith('"') && uri.endsWith('"')) ||
    (uri.startsWith("'") && uri.endsWith("'"))
  ) {
    uri = uri.slice(1, -1).trim();
  }
  return uri;
};

const connectDB = async () => {
  const uri = normalizeMongoUri(process.env.MONGO_URI);

  if (!uri) {
    console.error('MONGO_URI is missing or empty after trimming.');
    process.exit(1);
  }

  const scheme = uri.startsWith('mongodb+srv://')
    ? 'mongodb+srv'
    : uri.startsWith('mongodb://')
      ? 'mongodb'
      : 'unknown';

  if (scheme === 'unknown') {
    console.error(
      'MONGO_URI must start with mongodb:// or mongodb+srv:// (check .env for typos or stray quotes).'
    );
    process.exit(1);
  }

  // Atlas + local ISP networks are often flaky on IPv6. Prefer IPv4 unless explicitly overridden.
  // Supported values: 4, 6. If unset, we default to 4 for stability.
  try {
    dns.setDefaultResultOrder('ipv4first');
  } catch {
    /* no-op on unsupported Node runtimes */
  }

  const connectOptions = {
    serverSelectionTimeoutMS: Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS) || 25000,
    connectTimeoutMS: Number(process.env.MONGODB_CONNECT_TIMEOUT_MS) || 20000,
    family: 4,
  };
  const fam = String(process.env.MONGODB_CONNECT_FAMILY || '').trim();
  if (fam === '4' || fam === '6') {
    connectOptions.family = Number(fam);
  }

  const maxAttempts = Math.min(10, Math.max(1, Number(process.env.MONGODB_CONNECT_RETRIES) || 3));
  const retryDelayMs = Math.max(500, Number(process.env.MONGODB_RETRY_DELAY_MS) || 2000);

  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      if (scheme === 'mongodb+srv' && attempt === 1) {
        const srvHost = uri.split('@')[1]?.split('/')[0]?.split('?')[0];
        if (srvHost) {
          const records = await dnsPromises.resolveSrv(`_mongodb._tcp.${srvHost}`);
          if (records?.length) {
            const hosts = records.map((r) => `${r.name}:${r.port}`).join(', ');
            console.log(`Atlas SRV resolved: ${hosts}`);
          }
        }
      }
      const conn = await mongoose.connect(uri, connectOptions);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) {
        console.warn(
          `MongoDB connect attempt ${attempt}/${maxAttempts} failed: ${error.message}. Retrying in ${retryDelayMs}ms...`
        );
        try {
          await mongoose.disconnect();
        } catch {
          /* ignore */
        }
        await new Promise((r) => setTimeout(r, retryDelayMs));
        continue;
      }
      break;
    }
  }

  const error = lastError;
  if (!error) {
    console.error('MongoDB connection failed with no error detail.');
    process.exit(1);
  }

  console.error(`MongoDB connection error: ${error.message}`);
  if (
    error.message?.includes('whitelist') ||
    error.message?.includes('IP') ||
    error.message?.includes('Atlas')
  ) {
    console.error(
      '\nAtlas often reports this even when the IP list is open. Also check:\n' +
        '  • IPv4 vs IPv6: leave MONGODB_CONNECT_FAMILY unset for OS default, or set to 4 / 6 only (0 is invalid for the driver)\n' +
        '  • MONGO_URI has no extra quotes/spaces (copy from Atlas "Connect" → Drivers)\n' +
        '  • Password special characters are URL-encoded in the URI (@ → %40, etc.)\n' +
        '  • DNS / VPN / firewall blocking mongodb+srv SRV lookups\n' +
        '  • Transient errors: increase MONGODB_CONNECT_RETRIES or MONGODB_RETRY_DELAY_MS\n' +
        'Network Access: https://www.mongodb.com/docs/atlas/security/ip-access-list/\n'
    );
  }
  if (error.message?.includes('authentication failed')) {
    console.error(
      '\nCheck MONGO_URI username/password and that the database user exists in Atlas.\n'
    );
  }
  if (error.message?.includes("Option 'family' must be")) {
    console.error(
      '\nMONGODB_CONNECT_FAMILY must be 4, 6, or unset — not 0. Remove it from .env to use the default.\n'
    );
  }
  process.exit(1);
};

export default connectDB;
