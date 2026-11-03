import type { SignInResult } from "../types";

/** Demonstration only: nothing is checked or stored. Fails for one address. */
export async function signInMock(
  email: string,
  password: string,
): Promise<SignInResult> {
  void password;
  await new Promise((resolve) => setTimeout(resolve, 900));
  return email.trim().toLowerCase() === "error@example.com"
    ? { ok: false }
    : { ok: true };
}
