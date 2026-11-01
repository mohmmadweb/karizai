import { BrandLogo } from "@/components/brand/brand-logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "./login-form";

export function LoginPageContent() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background page-gutter py-10">
      <BrandLogo alt="موشکاف" variant="full" className="w-28" priority />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-h4">ورود به موشکاف</CardTitle>
          <CardDescription>
            برای ورود، ایمیل و رمز عبور خود را وارد کنید.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
