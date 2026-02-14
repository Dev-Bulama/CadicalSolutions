"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function ReferralsPage() {
  return (
    <div className="min-h-screen p-8 bg-background flex flex-col items-center">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-4xl flex items-center gap-2">🤝 Referrals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Professional referral services connecting you with expert healthcare networks.
            Ensuring you get the right care with trusted specialists.
          </p>
          <h2 className="text-2xl font-semibold">Referral Services</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Specialist doctor referrals</li>
            <li>Inter-hospital patient transfers</li>
            <li>International medical network connections</li>
            <li>Coordinated care for complex cases</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
