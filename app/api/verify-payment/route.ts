import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const response = await fetch(
      `https://api.flutterwave.com/v3/transactions/${body.transaction_id}/verify`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        },
      }
    )

    const data = await response.json()

    if (
      data.status === 'success' &&
      data.data.status === 'successful'
    ) {
      return NextResponse.json({
        status: 'success',
        data,
      })
    }

    return NextResponse.json(
      {
        status: 'failed',
      },
      { status: 400 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
      },
      { status: 500 }
    )
  }
}