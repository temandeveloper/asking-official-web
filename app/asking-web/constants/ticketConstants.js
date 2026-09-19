export const CATEGORY_OPTIONS = [
  { id: "technical", label: "Technical", color: "blue" },
  { id: "issue", label: "Issue", color: "rose" },
  { id: "marketing", label: "Marketing", color: "amber" },
  { id: "support", label: "Support", color: "purple" },
  { id: "general", label: "General", color: "emerald" },
];

export const STATUS_OPTIONS = [
  { value: "Cancelled", label: "Cancelled", color: "rose" },
  { value: "New", label: "New", color: "blue" },
  { value: "Under Review", label: "Under Review", color: "purple" },
  { value: "In Progress", label: "In Progress", color: "amber" },
  { value: "Completed", label: "Completed", color: "emerald" },
];

export const STATUS_COLUMNS = [
  {
    id: "Cancelled",
    title: "Cancelled",
    color: "rose",
    accentBorder: "border-t-rose-500",
    badgeBg: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300",
    dotColor: "bg-rose-500",
    barColor: "bg-rose-500",
    order: 1,
  },
  {
    id: "New",
    title: "New",
    color: "blue",
    accentBorder: "border-t-blue-500",
    badgeBg: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300",
    dotColor: "bg-blue-500",
    barColor: "bg-blue-500",
    order: 2,
  },
  {
    id: "Under Review",
    title: "Under Review",
    color: "purple",
    accentBorder: "border-t-purple-500",
    badgeBg:
      "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300",
    dotColor: "bg-purple-500",
    barColor: "bg-purple-500",
    order: 3,
  },
  {
    id: "In Progress",
    title: "In Progress",
    color: "amber",
    accentBorder: "border-t-amber-500",
    badgeBg:
      "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300",
    dotColor: "bg-amber-500",
    barColor: "bg-amber-500",
    order: 4,
  },
  {
    id: "Completed",
    title: "Completed",
    color: "emerald",
    accentBorder: "border-t-emerald-500",
    badgeBg:
      "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300",
    dotColor: "bg-emerald-500",
    barColor: "bg-emerald-500",
    order: 5,
  },
];

export const PRIORITY_OPTIONS = [
  { id: "lowest", title: "Lowest", color: "slate" },
  { id: "low", title: "Low", color: "blue" },
  { id: "medium", title: "Medium", color: "amber" },
  { id: "high", title: "High", color: "orange" },
  { id: "urgent", title: "Urgent", color: "rose" },
];
