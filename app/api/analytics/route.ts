import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

  const [
    totalUsers,
    newUsersThisMonth,
    totalOrders,
    ordersThisMonth,
    totalRevenue,
    revenueThisMonth,
    revenueLastMonth,
    pendingOrders,
    totalProducts,
    lowStockProducts,
    totalBookings,
    pendingBookings,
    completedServiceJobs,
    totalTechnicians,
    activeTechnicians,
    totalSuppliers,
    approvedSuppliers,
    openRFQs,
    totalInstitutions,
    syncedContacts,
    failedSyncs,
    totalNotifications,
    unreadNotifications,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.order.aggregate({ _sum: { totalAmount: true }, where: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] } } }),
    prisma.order.aggregate({ _sum: { totalAmount: true }, where: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] }, createdAt: { gte: startOfMonth } } }),
    prisma.order.aggregate({ _sum: { totalAmount: true }, where: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] }, createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.product.count(),
    prisma.product.count({ where: { stock: { lt: 5 } } }),
    prisma.serviceBooking.count(),
    prisma.serviceBooking.count({ where: { status: { in: ["BOOKED", "PENDING_APPROVAL"] } } }),
    prisma.serviceJob.count({ where: { status: "COMPLETED" } }),
    prisma.technicianProfile.count(),
    prisma.technicianProfile.count({ where: { isAvailable: true, status: "ACTIVE" } }),
    prisma.supplier.count(),
    prisma.supplier.count({ where: { status: "APPROVED" } }),
    prisma.rFQ.count({ where: { status: "OPEN" } }),
    prisma.institution.count(),
    prisma.crmSyncLog.aggregate({ _sum: { recordsSynced: true }, where: { status: "success" } }),
    prisma.crmSyncLog.count({ where: { status: "failed" } }),
    prisma.notification.count(),
    prisma.notification.count({ where: { isRead: false } }),
  ])

  // Revenue trend (last 6 months)
  const revenueTrend = []
  for (let i = 5; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
    const result = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: {
        status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] },
        createdAt: { gte: start, lte: end },
      },
    })
    revenueTrend.push({
      month: start.toLocaleString("default", { month: "short" }),
      revenue: result._sum.totalAmount || 0,
    })
  }

  // Top products by order count
  const topProducts = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
    _count: { orderId: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5,
  })

  const topProductDetails = await Promise.all(
    topProducts.map(async (p) => {
      const product = await prisma.product.findUnique({
        where: { id: p.productId },
        select: { name: true, category: true, price: true },
      })
      return { ...product, quantity: p._sum.quantity, orders: p._count.orderId }
    })
  )

  // Service booking by type
  const serviceByType = await prisma.serviceBooking.groupBy({
    by: ["serviceType"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
  })

  const revenueGrowth = revenueLastMonth._sum.totalAmount
    ? (((revenueThisMonth._sum.totalAmount || 0) - (revenueLastMonth._sum.totalAmount || 0)) /
        (revenueLastMonth._sum.totalAmount || 1)) *
      100
    : 0

  return NextResponse.json({
    overview: {
      totalUsers,
      newUsersThisMonth,
      totalOrders,
      ordersThisMonth,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      revenueThisMonth: revenueThisMonth._sum.totalAmount || 0,
      revenueGrowth: Math.round(revenueGrowth * 10) / 10,
      pendingOrders,
      totalProducts,
      lowStockProducts,
      totalBookings,
      pendingBookings,
      completedServiceJobs,
      totalTechnicians,
      activeTechnicians,
      totalSuppliers,
      approvedSuppliers,
      openRFQs,
      totalInstitutions,
      crmSyncedContacts: syncedContacts._sum.recordsSynced || 0,
      crmFailedSyncs: failedSyncs,
      unreadNotifications,
    },
    charts: {
      revenueTrend,
      topProducts: topProductDetails,
      serviceByType,
    },
  })
}
