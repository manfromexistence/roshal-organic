import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/storefront/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="storefront-auth-page container mx-auto flex justify-center px-4 pt-6 pb-4">
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
