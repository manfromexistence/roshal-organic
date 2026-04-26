import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Privacy Policy - Quadra EDMS",
  description:
    "Privacy Policy for Quadra Enterprise Document Management System",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col gap-6 py-6 min-w-0">
      <div className="px-4 lg:px-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground">Last updated: April 23, 2026</p>
      </div>

      <div className="px-4 lg:px-6 max-w-4xl">
        <Card>
          <CardContent className="pt-6 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                1. Information We Collect
              </h2>
              <p className="text-muted-foreground">
                We collect information you provide directly to us, such as when
                you create an account, use our services, or communicate with us.
                This may include your name, email address, and other information
                you choose to provide.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                2. How We Use Your Information
              </h2>
              <p className="text-muted-foreground">
                We use the information we collect to provide, maintain, and
                improve our services, to process transactions and send related
                information, to send technical notices and support messages, and
                to respond to your comments and questions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                3. Information Sharing
              </h2>
              <p className="text-muted-foreground">
                We do not sell, trade, or otherwise transfer your personal
                information to third parties without your consent, except as
                described in this policy or as required by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                4. Data Security
              </h2>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational measures
                to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                5. Data Retention
              </h2>
              <p className="text-muted-foreground">
                We retain your personal information for as long as necessary to
                provide our services and fulfill the purposes outlined in this
                privacy policy, unless a longer retention period is required or
                permitted by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                6. Your Rights
              </h2>
              <p className="text-muted-foreground">
                You have the right to access, correct, or delete your personal
                information. You may also opt out of certain communications from
                us at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                7. Changes to This Policy
              </h2>
              <p className="text-muted-foreground">
                We may update this privacy policy from time to time. We will
                notify you of any changes by posting the new privacy policy on
                this page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                8. Contact Us
              </h2>
              <p className="text-muted-foreground">
                If you have any questions about this privacy policy, please
                contact our support team through your dashboard.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
