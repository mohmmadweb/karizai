"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { TriangleAlertIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signInMock } from "../data/mock-sign-in";
import type { LoginFieldErrors } from "../types";
import { PasswordField } from "@/components/shared/password-field";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(value: string) {
  if (!value.trim()) return "لطفاً ایمیل خود را وارد کنید.";
  if (!emailPattern.test(value.trim()))
    return "ایمیل باید به شکل name@example.com نوشته شود.";
  return undefined;
}

function validatePassword(value: string) {
  return value ? undefined : "لطفاً رمز عبور خود را وارد کنید.";
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginFieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "failed">(
    "idle",
  );
  const submitting = status === "submitting";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const next = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(next);
    if (next.email || next.password) return;
    setStatus("submitting");
    const result = await signInMock(email, password);
    if (result.ok) {
      router.push("/admin");
    } else {
      setStatus("failed");
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      {status === "failed" ? (
        <Alert variant="destructive">
          <TriangleAlertIcon aria-hidden />
          <AlertTitle>ورود انجام نشد</AlertTitle>
          <AlertDescription>
            مشکلی در ورود پیش آمد. لطفاً چند لحظه بعد دوباره تلاش کنید.
          </AlertDescription>
        </Alert>
      ) : null}
      <FieldGroup>
        <Field data-invalid={errors.email ? true : undefined}>
          <FieldLabel htmlFor="login-email">ایمیل</FieldLabel>
          <Input
            id="login-email"
            type="email"
            dir="ltr"
            autoComplete="username"
            placeholder="name@example.com"
            className="text-start"
            value={email}
            disabled={submitting}
            aria-invalid={errors.email ? true : undefined}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setErrors((c) => ({ ...c, email: validateEmail(email) }))}
          />
          <FieldError>{errors.email}</FieldError>
        </Field>
        <Field data-invalid={errors.password ? true : undefined}>
          <FieldLabel htmlFor="login-password">رمز عبور</FieldLabel>
          <PasswordField
            id="login-password"
            autoComplete="current-password"
            value={password}
            disabled={submitting}
            aria-invalid={errors.password ? true : undefined}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() =>
              setErrors((c) => ({ ...c, password: validatePassword(password) }))
            }
          />
          <FieldError>{errors.password}</FieldError>
        </Field>
      </FieldGroup>
      <Button type="submit" size="lg" loading={submitting} className="w-full">
        ورود
      </Button>
    </form>
  );
}
