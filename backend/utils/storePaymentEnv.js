/** Dotenv values are strings; trim and strip optional wrapping quotes. */
export const envClean = (value) => {
  if (value == null) return '';
  let s = String(value).trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  return s;
};

export const envFirst = (...keys) => {
  for (const key of keys) {
    const v = envClean(process.env[key]);
    if (v) return v;
  }
  return '';
};

export const defaultReferenceHint = () =>
  'Include your order ID in the transfer narration or description so we can match your payment.';
