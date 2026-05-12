"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Truck, MapPin } from "lucide-react"
import { format } from "date-fns"

export function TrackingClient({
  order,
}: {
  order: any
}) {
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <Card className="rounded-3xl">
        <CardContent className="p-6 space-y-4">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Track Your Order
              </h1>

              <p className="text-muted-foreground">
                Tracking Code:{" "}
                <span className="font-medium">
                  {order.trackingCode}
                </span>
              </p>
            </div>

            <Badge>
              {order.status}
            </Badge>
          </div>

          <div className="grid md:grid-cols-3 gap-4 pt-4">

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Package className="w-5 h-5" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Carrier
                  </p>
                  <p className="font-semibold">
                    {order.carrier || "Not assigned"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Truck className="w-5 h-5" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Tracking Number
                  </p>
                  <p className="font-semibold">
                    {order.trackingNumber || "Pending"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <MapPin className="w-5 h-5" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Delivery Address
                  </p>
                  <p className="font-semibold line-clamp-2">
                    {order.shippingAddress}
                  </p>
                </div>
              </CardContent>
            </Card>

          </div>
        </CardContent>
      </Card>

      {/* TIMELINE */}
      <Card className="rounded-3xl">
        <CardContent className="p-6">

          <h2 className="text-xl font-bold mb-6">
            Tracking History
          </h2>

          <div className="space-y-6">

            {order.trackingEvents?.length > 0 ? (
              order.trackingEvents.map(
                (event: any, i: number) => (
                  <div
                    key={i}
                    className="flex gap-4"
                  >
                    <div className="w-3 h-3 mt-2 rounded-full bg-black" />

                    <div>
                      <p className="font-semibold">
                        {event.status}
                      </p>

                      <p className="text-muted-foreground">
                        {event.message}
                      </p>

                      {event.location && (
                        <p className="text-sm">
                          📍 {event.location}
                        </p>
                      )}

                      <p className="text-xs text-muted-foreground mt-1">
                        {format(
                          new Date(event.createdAt),
                          "PPpp"
                        )}
                      </p>
                    </div>
                  </div>
                )
              )
            ) : (
              <p className="text-muted-foreground">
                No tracking updates yet.
              </p>
            )}

          </div>
        </CardContent>
      </Card>
    </div>
  )
}