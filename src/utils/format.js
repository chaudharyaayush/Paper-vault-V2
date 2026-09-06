export function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", { day:"2-digit", month:"short", year:"numeric" }).format(new Date(value));
}
export function initials(value = "") { return value.split(" ").filter(Boolean).slice(0,2).map((part)=>part[0]).join("").toUpperCase(); }
