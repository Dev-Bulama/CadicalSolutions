"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function DiagnosticsPage() {
  return (
    <div className="min-h-screen p-8 bg-background flex flex-col items-center">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-4xl flex items-center gap-2">🔬 Diagnostics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            3D radiological imaging and laboratory investigations with precision and sensitivity.
            Fast, accurate, and reliable diagnostic services.
          </p>
          <h2 className="text-2xl font-semibold">Our Services</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>CT, MRI, and X-ray imaging</li>
            <li>Laboratory testing and analysis</li>
            <li>Pathology and molecular diagnostics</li>
            <li>Health screening programs</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
