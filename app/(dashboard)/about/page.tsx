import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "About - Quadra EDMS",
  description: "Learn about Quadra Enterprise Document Management System",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-6 py-6 min-w-0">
      <div className="px-4 lg:px-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          About Quadra EDMS
        </h1>
        <p className="text-muted-foreground">
          Enterprise Document Management System for modern organizations
        </p>
      </div>

      <div className="px-4 lg:px-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Quadra EDMS is designed to streamline document management for
              enterprises of all sizes. We provide a secure, scalable, and
              user-friendly platform for organizing, sharing, and collaborating
              on documents.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Secure document storage and access control</li>
              <li>Advanced search and filtering capabilities</li>
              <li>Version control and audit trails</li>
              <li>Integration with existing enterprise systems</li>
              <li>Real-time collaboration tools</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technology Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Built with Next.js 16.2.4, React 19, TypeScript, and modern web
              technologies to ensure performance, security, and maintainability.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              For support, inquiries, or partnership opportunities, please reach
              out to our team through the support channel in your dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
