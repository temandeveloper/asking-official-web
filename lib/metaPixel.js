export const CHECKOUT_URL = "https://lynk.id/asking-customer-manager/22ponx98x7vv/checkout";

export function trackMetaEvent(eventName, parameters) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;

  if (parameters) {
    window.fbq("track", eventName, parameters);
  } else {
    window.fbq("track", eventName);
  }
}

export function trackMetaCustomEvent(eventName, parameters) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;

  if (parameters) {
    window.fbq("trackCustom", eventName, parameters);
  } else {
    window.fbq("trackCustom", eventName);
  }
}

/**
 * Appends active ad tracking and campaign parameters (fbclid, utm_*)
 * from current window location to target URL so attribution is preserved.
 */
export function appendTrackingParams(targetUrlStr = CHECKOUT_URL) {
  if (typeof window === "undefined") return targetUrlStr;

  try {
    const currentUrl = new URL(window.location.href);
    const target = new URL(targetUrlStr, window.location.origin);

    const trackingKeys = [
      "fbclid",
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "utm_id",
    ];

    trackingKeys.forEach((key) => {
      const val = currentUrl.searchParams.get(key);
      if (val && !target.searchParams.has(key)) {
        target.searchParams.set(key, val);
      }
    });

    return target.toString();
  } catch {
    return targetUrlStr;
  }
}

export function trackMetaLinkEvent(event, eventName, parameters) {
  trackMetaEvent(eventName, parameters);

  const rawDestination =
    event.currentTarget?.getAttribute("href") ||
    event.currentTarget?.href ||
    CHECKOUT_URL;
  const destination = appendTrackingParams(rawDestination);

  // If opening in new tab or modifier key pressed, let browser handle navigation natively
  if (
    event.currentTarget?.target === "_blank" ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    if (event.currentTarget) {
      event.currentTarget.href = destination;
    }
    return;
  }

  if (event.defaultPrevented || event.button !== 0) {
    return;
  }

  event.preventDefault();

  window.setTimeout(() => {
    window.location.assign(destination);
  }, 150);
}

