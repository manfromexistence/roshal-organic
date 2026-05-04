import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/storefront/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="storefront-auth-page container mx-auto flex min-h-full flex-1 items-center justify-center px-4 py-4">
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
