import  prisma  from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const refId = searchParams.get('refId');

    // Get single referral
    if (refId) {
      const referral = await prisma.referral.findUnique({
        where: { refId },
      });

      if (!referral) {
        return NextResponse.json(
          { error: 'Referral not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(referral);
    }

    // Get all referrals
    const referrals = await prisma.referral.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(referrals);
  } catch (error) {
    console.error('Error fetching referrals:', error);

    return NextResponse.json(
      { error: 'Failed to fetch referrals' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const referral = await prisma.referral.create({
      data: {
        refId: body.refId,
        referrerFullName: body.referrerFullName,
        referrerDesignation: body.referrerDesignation,
        referrerFacility: body.referrerFacility,
        referrerFacilityType: body.referrerFacilityType,
        referrerPhone: body.referrerPhone,
        referrerEmail: body.referrerEmail,
        referrerState: body.referrerState,
        referrerLGA: body.referrerLGA,
        referrerAddress: body.referrerAddress,

        clientFacilityName: body.clientFacilityName,
        clientType: body.clientType,
        clientContactPerson: body.clientContactPerson,
        clientPhone: body.clientPhone,
        clientEmail: body.clientEmail,
        clientState: body.clientState,
        clientLGA: body.clientLGA,
        clientAddress: body.clientAddress,

        reasonForRequest: body.reasonForRequest,
        supplyCategory: body.supplyCategory,
        specificTests: body.specificTests,
        urgencyLevel: body.urgencyLevel,
        quantity: body.quantity,
        deliveryMethod: body.deliveryMethod,
        additionalNotes: body.additionalNotes,

        affiliateId: body.affiliateId,
        referredVia: body.referredVia,
        paymentPreference: body.paymentPreference,
        estimatedValue: body.estimatedValue,
        consent: body.consent,
      },
    });

    return NextResponse.json(referral, { status: 201 });
  } catch (error) {
    console.error('Error creating referral:', error);

    return NextResponse.json(
      { error: 'Failed to create referral' },
      { status: 500 }
    );
  }
}

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const refId = searchParams.get('refId');

//     if (refId) {
//       const referral = await prisma.referral.findUnique({
//         where: { refId },
//       });

//       return NextResponse.json(referral);
//     }

//     const referrals = await prisma.referral.findMany({
//       orderBy: { createdAt: 'desc' },
//     });

//     return NextResponse.json(referrals);
//   } catch (error) {
//     console.error('Error fetching referrals:', error);

//     return NextResponse.json(
//       { error: 'Failed to fetch referrals' },
//       { status: 500 }
//     );
//   }
// }