import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  const checks: Record<string, any> = {}

  // 1. Env vars
  checks.BETTER_AUTH_SECRET = !!process.env.BETTER_AUTH_SECRET
  checks.BETTER_AUTH_URL    = process.env.BETTER_AUTH_URL ?? "NOT SET"
  checks.DATABASE_URL       = process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:([^:@]+)@/, ":***@") : "NOT SET"

  // 2. DB connection
  try {
    await prisma.$queryRaw`SELECT 1`
    checks.db_connected = true
  } catch (e: any) {
    checks.db_connected = false
    checks.db_error = e?.message
  }

  // 3. Tables exist
  try {
    const userCount = await prisma.user.count()
    checks.user_table_exists = true
    checks.user_count = userCount
  } catch (e: any) {
    checks.user_table_exists = false
    checks.user_table_error = e?.message
  }

  try {
    const accountCount = await prisma.account.count()
    checks.account_table_exists = true
    checks.account_count = accountCount
  } catch (e: any) {
    checks.account_table_exists = false
    checks.account_table_error = e?.message
  }

  // 4. Diagnosis
  const issues: string[] = []
  if (!checks.BETTER_AUTH_SECRET)     issues.push("MISSING: BETTER_AUTH_SECRET env var — add this to Hostinger")
  if (checks.BETTER_AUTH_URL === "NOT SET") issues.push("MISSING: BETTER_AUTH_URL env var — set to https://skillride.com.ng")
  if (!checks.db_connected)           issues.push("DB connection failed — check DATABASE_URL")
  if (!checks.user_table_exists)      issues.push("User table missing — run: npx prisma migrate deploy")
  if (checks.user_count === 0)        issues.push("No users in DB — run seed endpoint ?step=users then ?step=profiles")

  return NextResponse.json({ checks, issues, ok: issues.length === 0 })
}
