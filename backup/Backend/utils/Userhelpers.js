// ── utils/userHelpers.js ──────────────────────────────────────────────────────
// Shared helpers used across auth controllers and anywhere user data is returned.

export const normalizeUserImage = (image) => {
  if (!image) return "";
  return image.startsWith("/image/")
    ? image
    : `/image/${image.split(/[\\/]/).pop()}`;
};

export const toSafeUser = (user) => {
  if (!user) return null;
  const raw = user.toObject ? user.toObject() : user;
  const { password, ...safeRaw } = raw;
  return { ...safeRaw, image: normalizeUserImage(raw.image) };
};