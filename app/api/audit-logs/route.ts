import { NextRequest, NextResponse } from "next/server"
import { getAuditLogs } from "@/lib/audit"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const entity = searchParams.get("entity") || undefined
  const action = searchParams.get("action") || undefined
  const userId = searchParams.get("userId") || undefined
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "50")

  const result = await getAuditLogs({ entity, action, userId, page, limit })
  return NextResponse.json(result)
}
