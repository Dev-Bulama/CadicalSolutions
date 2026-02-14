"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function PharmaceuticalsPage() {
  return (
    <div className="min-h-screen p-8 bg-background flex flex-col items-center">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-4xl flex items-center gap-2">💊 Pharmaceuticals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Access the latest WHO-approved drugs and medical equipment. All products come with 100% efficacy assurance and safety standards.
          </p>
          <h2 className="text-2xl font-semibold">Our Products</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Prescription medications</li>
            <li>Over-the-counter drugs</li>
            <li>Medical devices and equipment</li>
            <li>Vaccines and immunizations</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
