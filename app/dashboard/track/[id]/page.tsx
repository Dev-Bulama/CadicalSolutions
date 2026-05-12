import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

async function getOrder(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/orders/${id}`,
    { cache: "no-store" }
  )

  return res.json()
}

export default async function Page({
  params,
}: {
  params: { id: string }
}) {
  const order = await getOrder(params.id)

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">

      {/* ORDER INFO */}
      <Card>
        <CardHeader>
          <CardTitle>Order Tracking</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          <p><b>ID:</b> {order.id}</p>
          <p>
            <b>Status:</b>{" "}
            <Badge>{order.status}</Badge>
          </p>
          <p>
            <b>Total:</b> ${order.totalAmount}
          </p>
        </CardContent>
      </Card>

      {/* TIMELINE */}
      <Card>
        <CardHeader>
          <CardTitle>Tracking History</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          {order.trackingEvents?.length ? (
            order.trackingEvents.map((e: any) => (
              <div
                key={e.id}
                className="border-l pl-4 space-y-1"
              >
                <p className="font-semibold">
                  {e.status}
                </p>

                <p className="text-sm text-muted-foreground">
                  {e.message}
                </p>

                {e.location && (
                  <p className="text-xs">
                    📍 {e.location}
                  </p>
                )}

                <p className="text-xs text-muted-foreground">
                  {new Date(e.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">
              No tracking updates yet
            </p>
          )}

        </CardContent>
      </Card>

    </div>
  )
}