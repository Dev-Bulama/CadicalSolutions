import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'



export async function POST(req: Request) {
  try {
    // ======================================================
    // SESSION
    // ======================================================

    const session = await auth.api.getSession({
      headers: req.headers
  })

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          status: 'unauthorized',
        },
        { status: 401 }
      )
    }

    // ======================================================
    // BODY
    // ======================================================

    const body = await req.json()

    /**
     * expected body:
     *
     * {
     *   transaction_id: number
     *   cartItems: []
     *   shippingAddress: string
     *   totalAmount: number
     * }
     */

    // ======================================================
    // VERIFY PAYMENT
    // ======================================================

    const response = await fetch(
      `https://api.flutterwave.com/v3/transactions/${body.transaction_id}/verify`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        },
      }
    )

    const flutterwaveData =
      await response.json()

    // ======================================================
    // CHECK PAYMENT STATUS
    // ======================================================

    if (
      flutterwaveData.status !==
        'success' ||
      flutterwaveData.data.status !==
        'successful'
    ) {
      return NextResponse.json(
        {
          status: 'failed',
        },
        { status: 400 }
      )
    }

    // ======================================================
    // CREATE ORDER
    // ======================================================

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,

        totalAmount: body.totalAmount,

        paymentId: String(
          body.transaction_id
        ),

        paymentMethod: 'FLUTTERWAVE',

        shippingAddress:
          body.shippingAddress,

        status: 'PAID',

        orderItems: {
          create: body.cartItems.map(
            (item: any) => ({
              productId: item.id,

              quantity:
                item.quantity,

              price: item.price,
            })
          ),
        },
      },

      include: {
        orderItems: true,
      },
    })

    // ======================================================
    // OPTIONAL:
    // CLEAR USER CART
    // ======================================================

    // await prisma.cartItem.deleteMany({
    //   where: {
    //     userId: session.user.id,
    //   },
    // })

    // ======================================================
    // SUCCESS
    // ======================================================

    return NextResponse.json({
      status: 'success',
      order,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        status: 'error',
      },
      { status: 500 }
    )
  }
}

// import { NextResponse } from 'next/server'

// export async function POST(req: Request) {
//   try {
//     const body = await req.json()

//     const response = await fetch(
//       `https://api.flutterwave.com/v3/transactions/${body.transaction_id}/verify`,
//       {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
//         },
//       }
//     )

//     const data = await response.json()

//     if (
//       data.status === 'success' &&
//       data.data.status === 'successful'
//     ) {
//       return NextResponse.json({
//         status: 'success',
//         data,
//       })
//     }

//     return NextResponse.json(
//       {
//         status: 'failed',
//       },
//       { status: 400 }
//     )
//   } catch (error) {
//     return NextResponse.json(
//       {
//         status: 'error',
//       },
//       { status: 500 }
//     )
//   }
// }