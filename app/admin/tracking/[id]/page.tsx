import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

const STEPS = [
  "PENDING",
  "PROCESSING",
  "PACKAGED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
]

async function getOrder(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/orders/${id}`,
    {
      cache: "no-store",
    }
  )

  return res.json()
}

export default async function TrackingPage({
  params,
}: {
  params: { id: string }
}) {
  const order = await getOrder(params.id)

  const currentStep = STEPS.indexOf(order.status)

  return (
    <div className="max-w-3xl mx-auto p-6">

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>
            Package Tracking
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">

          {/* ORDER INFO */}
          <div className="space-y-2">
            <p>
              <span className="font-semibold">
                Order ID:
              </span>{" "}
              {order.id}
            </p>

            <div className="flex items-center gap-2">
              <span className="font-semibold">
                Current Status:
              </span>

              <Badge>
                {order.status.replaceAll("_", " ")}
              </Badge>
            </div>
          </div>

          {/* PROGRESS */}
          <div className="space-y-6">

            {STEPS.map((step, index) => {
              const completed =
                index <= currentStep

              return (
                <div
                  key={step}
                  className="flex items-center gap-4"
                >
                  {/* ICON */}
                  <div
                    className={`
                      w-10 h-10 rounded-full
                      flex items-center justify-center
                      border
                      ${
                        completed
                          ? "bg-black text-white"
                          : "bg-muted"
                      }
                    `}
                  >
                    {completed ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* LABEL */}
                  <div>
                    <p className="font-medium">
                      {step.replaceAll("_", " ")}
                    </p>

                    {index === currentStep && (
                      <p className="text-sm text-muted-foreground">
                        Current package stage
                      </p>
                    )}
                  </div>
                </div>
              )
            })}

          </div>

          {/* LATEST UPDATE */}
          {order.trackingEvents?.[0] && (
            <div className="border rounded-2xl p-4">
              <p className="font-semibold mb-1">
                Latest Update
              </p>

              <p className="text-muted-foreground">
                {
                  order.trackingEvents[0]
                    .message
                }
              </p>

              <p className="text-xs text-muted-foreground mt-2">
                {new Date(
                  order.trackingEvents[0].createdAt
                ).toLocaleString()}
              </p>
            </div>
          )}

        </CardContent>
      </Card>

    </div>
  )
}