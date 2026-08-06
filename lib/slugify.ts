// Turns a company name + provider id into a stable, URL-safe slug like
// "acme-legal-a1b2c3". Appending part of the id guarantees uniqueness
// without needing a database lookup loop.
export function slugify(companyName: string, providerId: string) {
  const base = companyName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${base}-${providerId.slice(-6)}`;
}
