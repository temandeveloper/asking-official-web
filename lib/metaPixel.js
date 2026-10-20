export function trackMetaEvent(eventName, parameters) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;

  window.fbq("track", eventName, parameters);
}

export function trackMetaCustomEvent(eventName, parameters) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;

  window.fbq("trackCustom", eventName, parameters);
}

export function trackMetaLinkEvent(event, eventName, parameters) {
  trackMetaEvent(eventName, parameters);

  // If opening in new tab or modifier key pressed, let browser handle navigation natively
  if (
    event.currentTarget?.target === "_blank" ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  if (event.defaultPrevented || event.button !== 0) {
    return;
  }

  const destination = event.currentTarget.href;
  event.preventDefault();

  window.setTimeout(() => {
    window.location.assign(destination);
  }, 200);
}
