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

function getCookie(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^|;\\s*)" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function extractFbclidFromFbcCookie() {
  const fbc = getCookie("_fbc");
  if (!fbc) return null;
  // Meta _fbc format: fb.1.<timestamp>.<fbclid>
  const parts = fbc.split(".");
  return parts.length >= 4 ? parts.slice(3).join(".") : null;
}

/**
 * Appends active ad tracking and campaign parameters (fbclid, utm_*)
 * from current window location, session storage, or Meta's _fbc cookie
 * to the target URL so attribution is 100% preserved even if the URL was cleaned.
 */
export function appendTrackingParams(targetUrlStr = CHECKOUT_URL) {
  if (typeof window === "undefined") return targetUrlStr;

  try {
    const currentUrl = new URL(window.location.href);
    const target = new URL(targetUrlStr, window.location.origin);

    const trackingKeys = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "utm_id",
    ];

    // 1. Resolve and persist UTM parameters
    trackingKeys.forEach((key) => {
      let val = currentUrl.searchParams.get(key);
      if (val) {
        try {
          sessionStorage.setItem(`as_${key}`, val);
        } catch {}
      } else {
        try {
          val = sessionStorage.getItem(`as_${key}`);
        } catch {}
      }

      if (val && !target.searchParams.has(key)) {
        target.searchParams.set(key, val);
      }
    });

    // 2. Resolve and persist fbclid (URL -> SessionStorage -> _fbc cookie)
    let fbclid = currentUrl.searchParams.get("fbclid");
    if (fbclid) {
      try {
        sessionStorage.setItem("as_fbclid", fbclid);
      } catch {}
    } else {
      try {
        fbclid = sessionStorage.getItem("as_fbclid");
      } catch {}
      if (!fbclid) {
        fbclid = extractFbclidFromFbcCookie();
      }
    }

    if (fbclid && !target.searchParams.has("fbclid")) {
      target.searchParams.set("fbclid", fbclid);
    }

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

