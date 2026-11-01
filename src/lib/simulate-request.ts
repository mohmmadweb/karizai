/** Short pause so the loading state of a button is visible. No request is made. */
export function simulateRequest(ms = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
