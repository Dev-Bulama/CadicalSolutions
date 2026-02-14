"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function RehabilitationPage() {
  return (
    <div className="min-h-screen p-8 bg-background flex flex-col items-center">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-4xl flex items-center gap-2">🏃 Rehabilitation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Physical therapy, occupational therapy, and sports medicine rehabilitation.
            Helping patients regain strength, mobility, and independence.
          </p>
          <h2 className="text-2xl font-semibold">Our Programs</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Physiotherapy sessions</li>
            <li>Sports injury rehab</li>
            <li>Post-operative recovery</li>
            <li>Occupational therapy support</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
