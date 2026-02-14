"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function CosmeticsPage() {
  return (
    <div className="min-h-screen p-8 bg-background flex flex-col items-center">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-4xl flex items-center gap-2">✨ Cosmetics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Latest cosmetology and dermatology services with skin care solutions.
            Enhancing your natural beauty safely and effectively.
          </p>
          <h2 className="text-2xl font-semibold">Our Treatments</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Skin rejuvenation</li>
            <li>Facial and aesthetic treatments</li>
            <li>Laser therapies</li>
            <li>Cosmetic dermatology consultations</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
