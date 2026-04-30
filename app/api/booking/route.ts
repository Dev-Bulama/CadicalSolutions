import { NextRequest, NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";

function generateRef() {
  return "CAD-" + Math.floor(100000 + Math.random() * 900000);
}

// ----------------------
// CREATE BOOKING
// ----------------------
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ----------------------
    // SERVER VALIDATION (strict)
    // ----------------------
    if (!body.service) {
      return NextResponse.json(
        { error: "Service is required" },
        { status: 400 }
      );
    }

    if (
      !body.firstName ||
      !body.lastName ||
      !body.phone ||
      !body.email ||
      !body.location ||
      !body.callerType
    ) {
      return NextResponse.json(
        { error: "Missing required personal details" },
        { status: 400 }
      );
    }

    if (!body.bookingType) {
      return NextResponse.json(
        { error: "Booking type is required" },
        { status: 400 }
      );
    }

    if (body.bookingType === "slot") {
      if (!body.prefDate || !body.selectedSlot) {
        return NextResponse.json(
          { error: "Date and slot required" },
          { status: 400 }
        );
      }
    }

    if (body.bookingType === "callback") {
      if (!body.callbackDate || !body.callWindow || !body.callbackPhone) {
        return NextResponse.json(
          { error: "Callback details required" },
          { status: 400 }
        );
      }
    }

    // ----------------------
    // CREATE RECORD
    // ----------------------
    const booking = await prisma.booking.create({
      data: {
        service: body.service,

        equipmentType: body.equipmentType,
        issueType: body.issueType,
        urgency: body.urgency,

        consultType: body.consultType,
        format: body.format,

        callerType: body.callerType,

        firstName: body.firstName,
        lastName: body.lastName,
        orgName: body.orgName,
        role: body.role,

        phone: body.phone,
        email: body.email,
        location: body.location,

        bookingType: body.bookingType,

        prefDate: body.prefDate,
        selectedSlot: body.selectedSlot,

        callbackDate: body.callbackDate,
        callWindow: body.callWindow,
        callbackPhone: body.callbackPhone,

        notes: body.notes,

        ref: generateRef(),
      },
    });

    return NextResponse.json({
      success: true,
      ref: booking.ref,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// ----------------------
// GET BOOKINGS (ADMIN USE)
// ----------------------
export async function GET() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(bookings);
}