"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function EmergencyServicesPage() {
  return (
    <div className="min-h-screen p-8 bg-background flex flex-col items-center">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-4xl flex items-center gap-2">🚑 Emergency Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Quick response emergency medical services with advanced life support capabilities.
            Available 24/7 for urgent care and critical situations.
          </p>
          <h2 className="text-2xl font-semibold">Our Emergency Services</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Ambulance and rapid response</li>
            <li>Advanced life support</li>
            <li>Trauma care and stabilization</li>
            <li>On-site emergency interventions</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
