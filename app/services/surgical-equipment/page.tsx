"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function SurgicalEquipmentPage() {
  return (
    <div className="min-h-screen p-8 bg-background flex flex-col items-center">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-4xl flex items-center gap-2">⚕️ Surgical Equipment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Advanced surgical devices including computer-assisted and robotically-assisted systems.
            Ensuring precision and safety in all procedures.
          </p>
          <h2 className="text-2xl font-semibold">Our Equipment</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Robot-assisted surgical systems</li>
            <li>Laparoscopic and endoscopic tools</li>
            <li>Precision monitoring equipment</li>
            <li>Advanced sterilization and safety systems</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
