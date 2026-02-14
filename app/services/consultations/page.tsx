"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function ConsultationsPage() {
  return (
    <div className="min-h-screen p-8 bg-background flex flex-col items-center">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-4xl flex items-center gap-2">💬 Consultations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Expert medical consultations across crucial health departments with international collaboration.
            Our doctors provide personalized care and guidance for your health needs.
          </p>
          <h2 className="text-2xl font-semibold">What We Offer</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>General health consultations</li>
            <li>Specialist advice in cardiology, neurology, and more</li>
            <li>Online & in-person appointments</li>
            <li>International collaboration for advanced cases</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
