import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Terms of Service - Quadra EDMS",
  description:
    "Terms of Service for Quadra Enterprise Document Management System",
};

export default function TermsPage() {
  return (
    <div className="flex flex-col gap-6 py-6 min-w-0">
      <div className="px-4 lg:px-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Terms of Service
        </h1>
        <p className="text-muted-foreground">Last updated: April 23, 2026</p>
      </div>

      <div className="px-4 lg:px-6 max-w-4xl">
        <Card>
          <CardContent className="pt-6 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                1. Acceptance of Terms
              </h2>
              <p className="text-muted-foreground">
                By accessing and using Quadra EDMS, you accept and agree to be
                bound by the terms and provisions of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                2. Use License
              </h2>
              <p className="text-muted-foreground">
                Permission is granted to temporarily download one copy of the
                materials on Quadra EDMS for personal, non-commercial transitory
                viewing only.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                3. Disclaimer
              </h2>
              <p className="text-muted-foreground">
                The materials on Quadra EDMS are provided on an 'as is' basis.
                Quadra EDMS makes no warranties, expressed or implied, and
                hereby disclaims and negates all other warranties including,
                without limitation, implied warranties or conditions of
                merchantability.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                4. Limitations
              </h2>
              <p className="text-muted-foreground">
                In no event shall Quadra EDMS or its suppliers be liable for any
                damages (including, without limitation, damages for loss of data
                or profit, or due to business interruption) arising out of the
                use or inability to use the materials on Quadra EDMS.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                5. Privacy Policy
              </h2>
              <p className="text-muted-foreground">
                Your privacy is important to us. Our Privacy Policy explains how
                we collect, use, and protect your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                6. Contact Information
              </h2>
              <p className="text-muted-foreground">
                For any questions about these Terms of Service, please contact
                our support team through your dashboard.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
