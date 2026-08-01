export function formatDate(value: string | null | undefined): string {
  if (!value) return "Not specified";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function daysRemaining(value: string | null | undefined): number | null {
  if (!value) return null;
  const target = new Date(value).getTime();
  if (Number.isNaN(target)) return null;
  return Math.ceil((target - Date.now()) / 86_400_000);
}

export function formatSalary(salary: string | null, min: number | null, max: number | null): string {
  if (salary) return salary;
  if (min && max && min !== max) return `₹${min.toLocaleString("en-IN")} - ₹${max.toLocaleString("en-IN")}`;
  if (min) return `₹${min.toLocaleString("en-IN")}`;
  return "As per government norms";
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return value.toLocaleString("en-IN");
}

export function classNames(...values: (string | false | null | undefined)[]): string {
  return values.filter(Boolean).join(" ");
}
