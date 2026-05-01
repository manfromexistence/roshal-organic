function trimTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function normalizedEnvUrl(value: string | undefined) {
  const trimmed = value?.trim().replace(/^["']|["']$/g, "");
  return trimmed || "";
}

export function getRoshalBaseUrl() {
  const candidate =
    normalizedEnvUrl(process.env.NEXT_PUBLIC_APP_URL) ||
    normalizedEnvUrl(process.env.BETTER_AUTH_URL) ||
    "https://roshalorganic.bd";

  return trimTrailingSlash(candidate);
}

export function getRoshalMetadataBase() {
  return new URL(getRoshalBaseUrl());
}

export function getRoshalAbsoluteUrl(path = "/") {
  return new URL(path, `${getRoshalBaseUrl()}/`).toString();
}

export function getRoshalSiteName() {
  return "Roshal Organic";
}
