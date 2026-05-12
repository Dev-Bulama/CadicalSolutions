import { TrackingClient } from "./tracking-client"

async function getOrder(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/orders/${id}/track`,
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

  return (
    <div className="container max-w-5xl py-10">
      <TrackingClient order={order} />
    </div>
  )
}