export function formatTransactionType(type) {
  return type
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatDateTime(dateString) {
  if (!dateString) return "";

  return new Date(dateString).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDateTimelong(dateString) {
  if (!dateString) return "";

  return new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(dateString));
}
export function formatDate(dateString) {
  if (!dateString) return "";

  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",

    month: "short",
    year: "numeric",
  });
}

export function formatAmount(amount) {
  if (amount === null || amount === undefined) return "0";

  const num = Number(amount);

  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1).replace(".0", "")}B`;
  }

  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1).replace(".0", "")}M`;
  }

  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1).replace(".0", "")}K`;
  }

  return num.toString();
}