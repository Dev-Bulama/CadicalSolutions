"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

type Order = {
  id: string
  totalAmount: number
  status: string
  createdAt: string
}

export default function Dashboard() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])

  async function load() {
    const res = await fetch("/api/orders")
    const data = await res.json()
    setOrders(data)
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        Admin Dashboard
      </h1>

      <Tabs defaultValue="orders">

        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
            </CardHeader>

            <CardContent>
              <Table>

                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {orders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell>{o.id}</TableCell>
                      <TableCell>{o.status}</TableCell>
                      <TableCell>${o.totalAmount}</TableCell>

                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() =>
                            router.push(`/track/${o.id}`)
                          }
                        >
                          View Tracking
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>

              </Table>
            </CardContent>

          </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}