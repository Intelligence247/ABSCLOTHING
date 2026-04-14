/**
 * Must be imported first from server.js (before any route/utils that read process.env).
 * ESM evaluates all static imports before the rest of the entry module runs, so
 * dotenv.config() cannot run after imports in the same file — env would be empty when
 * e.g. cloudinary.js configures the SDK at load time.
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env'), quiet: true });
