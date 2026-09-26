// Dates are rendered on the server, so pin the zone instead of depending on
// wherever the server happens to run.
const dateTime = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

const dateOnly = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: "UTC" });

export function formatDateTime(iso: string) {
  return `${dateTime.format(new Date(iso))} UTC`;
}

export function formatDate(iso: string) {
  return dateOnly.format(new Date(iso));
}

export function excerpt(value: string, max = 140) {
  const flat = value.replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max - 1).trimEnd()}…` : flat;
}
