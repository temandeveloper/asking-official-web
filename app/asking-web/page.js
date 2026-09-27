import { notFound } from "next/navigation";

/**
 * Accessing /asking-web directly without a valid team collaboration share code
 * is prohibited and returns a 404 Not Found page.
 */
export default function AskingWebRootPage() {
  notFound();
}
