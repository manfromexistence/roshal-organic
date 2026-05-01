export function stripPhoneDecorators(value: string) {
  return value.replace(/[^\d+]/g, "");
}

export function normalizeBangladeshPhoneInput(value: string) {
  const sanitized = stripPhoneDecorators(value);
  const digitsOnly = sanitized.replace(/\D/g, "");

  if (!digitsOnly) {
    return "";
  }

  if (digitsOnly.startsWith("880") && digitsOnly.length >= 13) {
    return `0${digitsOnly.slice(3, 13)}`;
  }

  if (digitsOnly.startsWith("0") && digitsOnly.length >= 11) {
    return digitsOnly.slice(0, 11);
  }

  return digitsOnly.slice(0, 11);
}

export function toBangladeshPhoneInputValue(value: string) {
  const normalized = normalizeBangladeshPhoneInput(value);

  if (!normalized) {
    return "";
  }

  return normalized.startsWith("0")
    ? `+880${normalized.slice(1)}`
    : `+880${normalized}`;
}

export function isBangladeshPhoneComplete(value: string) {
  const normalized = normalizeBangladeshPhoneInput(value);
  return normalized.length === 11 && normalized.startsWith("01");
}
