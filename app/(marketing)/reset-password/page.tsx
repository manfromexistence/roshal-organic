import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/storefront/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
