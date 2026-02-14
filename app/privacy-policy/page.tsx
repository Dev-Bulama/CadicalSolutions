import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const metadata = {
  title: "Privacy Policy | Cadical",
  description:
    "Learn how Cadical collects, uses, and protects your personal information.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/40 dark:to-muted/20 py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground mb-10">
          Effective Date: January 1, 2026
        </p>

        <Card className="rounded-2xl shadow-lg">
          <CardContent className="p-10 space-y-10">

            {/* Introduction */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">1. Introduction</h2>
              <p className="text-muted-foreground">
                Cadical is committed to protecting your privacy. This Privacy
                Policy explains how we collect, use, disclose, and safeguard
                your information when you visit our website or use our
                healthcare product and staffing services.
              </p>
            </section>

            <Separator />

            {/* Information We Collect */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">
                2. Information We Collect
              </h2>
              <p className="text-muted-foreground">
                We may collect personal information that you voluntarily provide
                to us, including:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Full name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Organization or facility details</li>
                <li>Any information submitted through contact forms</li>
              </ul>
            </section>

            <Separator />

            {/* How We Use Information */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">
                3. How We Use Your Information
              </h2>
              <p className="text-muted-foreground">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Respond to inquiries and service requests</li>
                <li>Provide healthcare products and staffing solutions</li>
                <li>Improve our website and services</li>
                <li>Communicate updates or important information</li>
              </ul>
            </section>

            <Separator />

            {/* Data Protection */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">4. Data Protection</h2>
              <p className="text-muted-foreground">
                We implement appropriate administrative, technical, and
                physical safeguards to protect your personal information from
                unauthorized access, disclosure, or misuse.
              </p>
            </section>

            <Separator />

            {/* Sharing of Information */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">
                5. Sharing of Information
              </h2>
              <p className="text-muted-foreground">
                Cadical does not sell or rent your personal information. We may
                share information with trusted partners or service providers
                solely for the purpose of delivering our services.
              </p>
            </section>

            <Separator />

            {/* Cookies */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">6. Cookies</h2>
              <p className="text-muted-foreground">
                Our website may use cookies or similar technologies to enhance
                user experience and analyze website performance. You may choose
                to disable cookies in your browser settings.
              </p>
            </section>

            <Separator />

            {/* User Rights */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">7. Your Rights</h2>
              <p className="text-muted-foreground">
                You have the right to request access to, correction of, or
                deletion of your personal information. To exercise these
                rights, please contact us using the information below.
              </p>
            </section>

            <Separator />

            {/* Contact */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">8. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please
                contact us at:
              </p>
              <p className="text-muted-foreground">
                Email: support@cadical.com
              </p>
              <p className="text-muted-foreground">
                Address: 123 Healthcare Avenue, Lagos, Nigeria
              </p>
            </section>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}
