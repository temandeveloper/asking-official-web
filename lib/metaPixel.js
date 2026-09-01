export function trackMetaEvent(eventName, parameters) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;

  window.fbq("track", eventName, parameters);
}

export function trackMetaCustomEvent(eventName, parameters) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;

  window.fbq("trackCustom", eventName, parameters);
}

export function trackMetaLinkEvent(event, eventName, parameters) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  const destination = event.currentTarget.href;
  event.preventDefault();
  trackMetaEvent(eventName, parameters);

  window.setTimeout(() => {
    window.location.assign(destination);
  }, 250);
}
