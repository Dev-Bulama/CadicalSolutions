import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  const connection = await prisma.crmConnection.findFirst({ where: { isActive: true } })
  if (!connection) return NextResponse.json({ jobs: [] })

  const jobs = await prisma.crmFailedJob.findMany({
    where: { connectionId: connection.id, status: { in: ["pending", "retrying"] } },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ jobs })
}

export async function POST(req: NextRequest) {
  const { id } = await req.json()

  const job = await prisma.crmFailedJob.findUnique({ where: { id } })
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 })

  if (job.retryCount >= job.maxRetries) {
    await prisma.crmFailedJob.update({ where: { id }, data: { status: "abandoned" } })
    return NextResponse.json({ success: false, message: "Max retries exceeded — job abandoned" })
  }

  await prisma.crmFailedJob.update({
    where: { id },
    data: { status: "retrying", retryCount: { increment: 1 } },
  })

  return NextResponse.json({ success: true, message: "Retry queued" })
}
