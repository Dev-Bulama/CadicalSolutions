import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const metadata = {
  title: "Terms | Cadical",
  description: "Read Cadical's refund terms and service engagement policies.",
}

export default function RefundServicePolicyPage() {
  return (
    <div className="min-h-screen py-24 px-6 bg-gradient-to-b from-background to-muted/40">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Terms</h1>
        <Card className="rounded-2xl shadow-lg">
          <CardContent className="p-10 space-y-10">

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">1. Product Refunds</h2>
              <p className="text-muted-foreground">
                Refunds are subject to product condition and regulatory
                compliance. Medical products that have been opened or used may
                not be eligible for return due to safety standards.
              </p>
            </section>

            <Separator />

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">2. Staffing Services</h2>
              <p className="text-muted-foreground">
                Staffing engagements are governed by contractual agreements.
                Fees for professional placement services are non-refundable
                once a placement has been confirmed.
              </p>
            </section>

            <Separator />

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">3. Service Modifications</h2>
              <p className="text-muted-foreground">
                Cadical reserves the right to modify service terms where
                necessary to comply with healthcare regulations.
              </p>
            </section>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}
