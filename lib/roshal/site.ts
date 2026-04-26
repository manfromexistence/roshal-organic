function trimTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function getRoshalBaseUrl() {
  const candidate =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.BETTER_AUTH_URL ||
    "http://localhost:3000";

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
