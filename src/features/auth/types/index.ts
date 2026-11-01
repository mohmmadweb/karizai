export type SignInResult = { ok: true } | { ok: false };

export type LoginFieldErrors = {
  email?: string;
  password?: string;
};
