"use client"

import { useEffect, useState } from "react"
import { pusherClient } from "@/lib/pusher-client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  PackageCheck,
  Truck,
  MapPin,
  Clock3,
  CheckCircle2,
} from "lucide-react"
import { format } from "date-fns"

interface TrackingEvent {
  status: string
  message: string
  location?: string
  createdAt: string | Date
}

interface Order {
  id: string
  status: string
  carrier?: string
  trackingNumber?: string
  shippingAddress?: string
  estimatedDelivery?: string
  trackingEvents: TrackingEvent[]
}

export function TrackingClient({
  order,
}: {
  order: Order
}) {
  const [events, setEvents] = useState<TrackingEvent[]>(
    order.trackingEvents || []
  )

  const [status, setStatus] = useState(order.status)

  useEffect(() => {
    const channel = pusherClient.subscribe(
      `order-${order.id}`
    )

    channel.bind(
      "tracking-update",
      (data: TrackingEvent) => {
        setStatus(data.status)

        setEvents((prev) => [
          {
            status: data.status,
            message: data.message,
            location: data.location,
            createdAt: new Date(),
          },
          ...prev,
        ])
      }
    )

    return () => {
      channel.unbind_all()
      pusherClient.unsubscribe(`order-${order.id}`)
    }
  }, [order.id])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-500"

      case "SHIPPED":
      case "OUT_FOR_DELIVERY":
        return "bg-blue-500"

      case "PENDING":
        return "bg-yellow-500"

      case "CANCELLED":
        return "bg-red-500"

      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <Card className="rounded-3xl border shadow-sm overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500" />

        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Order Tracking
              </h1>

              <p className="text-muted-foreground mt-1">
                Order #{order.id}
              </p>
            </div>

            <Badge className="rounded-full px-5 py-2 text-sm font-medium">
              {status.replaceAll("_", " ")}
            </Badge>
          </div>

          {/* ORDER INFO */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Carrier */}
            <Card className="rounded-2xl">
              <CardContent className="p-4 flex items-center gap-3">
                <PackageCheck className="w-5 h-5 text-primary" />

                <div>
                  <p className="text-sm text-muted-foreground">
                    Carrier
                  </p>

                  <p className="font-semibold">
                    {order.carrier || "DHL"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Number */}
            <Card className="rounded-2xl">
              <CardContent className="p-4 flex items-center gap-3">
                <Truck className="w-5 h-5 text-primary" />

                <div>
                  <p className="text-sm text-muted-foreground">
                    Tracking Number
                  </p>

                  <p className="font-semibold break-all">
                    {order.trackingNumber || "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Address */}
            <Card className="rounded-2xl">
              <CardContent className="p-4 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />

                <div>
                  <p className="text-sm text-muted-foreground">
                    Delivery Address
                  </p>

                  <p className="font-semibold line-clamp-2">
                    {order.shippingAddress || "No address"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* ETA */}
            <Card className="rounded-2xl">
              <CardContent className="p-4 flex items-center gap-3">
                <Clock3 className="w-5 h-5 text-primary" />

                <div>
                  <p className="text-sm text-muted-foreground">
                    Estimated Delivery
                  </p>

                  <p className="font-semibold">
                    {order.estimatedDelivery
                      ? format(
                          new Date(
                            order.estimatedDelivery
                          ),
                          "PPP"
                        )
                      : "Calculating..."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* TIMELINE */}
      <Card className="rounded-3xl border shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">
                Tracking Timeline
              </h2>

              <p className="text-muted-foreground mt-1">
                Live shipment updates in realtime
              </p>
            </div>

            <Badge
              variant="outline"
              className="rounded-full"
            >
              {events.length} Updates
            </Badge>
          </div>

          <div className="space-y-8">
            {events.map((event, index) => (
              <div
                key={index}
                className="flex gap-4"
              >
                {/* TIMELINE DOT */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-5 h-5 rounded-full ${getStatusColor(
                      event.status
                    )}`}
                  />

                  {index !== events.length - 1 && (
                    <div className="w-[2px] flex-1 bg-border mt-2" />
                  )}
                </div>

                {/* EVENT CONTENT */}
                <div className="pb-2 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />

                      <p className="font-semibold">
                        {event.status.replaceAll(
                          "_",
                          " "
                        )}
                      </p>
                    </div>

                    <Badge
                      variant="secondary"
                      className="rounded-full"
                    >
                      {format(
                        new Date(event.createdAt),
                        "PPpp"
                      )}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground mt-3 leading-relaxed">
                    {event.message}
                  </p>

                  {event.location && (
                    <div className="flex items-center gap-2 mt-3 text-sm">
                      <MapPin className="w-4 h-4" />

                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* EMPTY STATE */}
          {events.length === 0 && (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <Truck className="w-10 h-10 text-muted-foreground mb-4" />

              <h3 className="text-lg font-semibold">
                No tracking updates yet
              </h3>

              <p className="text-muted-foreground mt-2">
                Shipment updates will appear here once
                available.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}