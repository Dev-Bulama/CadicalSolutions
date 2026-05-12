import { TrackingClient } from "./tracking-client"


async function getOrder(code: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/track/${code}`,
    {
      cache: "no-store",
    }
  )

  if (!res.ok) return null

  return res.json()
}

export default async function Page({
  params,
}: {
  params: { code: string }
}) {
  const order = await getOrder(params.code)

  if (!order) {
    return (
      <div className="p-10 text-center">
        Order not found
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-10">
      <TrackingClient order={order} />
    </div>
  )
}