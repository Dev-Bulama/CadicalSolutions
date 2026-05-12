import axios from "axios"

const BASE_URL = "https://api.aftership.com/v4"

export async function createTracking({
  trackingNumber,
  slug,
}: {
  trackingNumber: string
  slug: string
}) {
  const response = await axios.post(
    `${BASE_URL}/trackings`,
    {
      tracking: {
        tracking_number: trackingNumber,
        slug,
      },
    },
    {
      headers: {
        "aftership-api-key": process.env.AFTERSHIP_API_KEY!,
        "Content-Type": "application/json",
      },
    }
  )

  return response.data
}