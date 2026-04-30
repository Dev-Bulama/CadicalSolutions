"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const [data, setData] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    setFiltered(
      data.filter((b) =>
        `${b.firstName} ${b.lastName} ${b.ref}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
    );
  }, [query, data]);

  const fetchBookings = async () => {
    setLoading(true);
    const res = await fetch("/api/booking");
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/booking", {
      method: "PATCH",
      body: JSON.stringify({ id, status }),
    });
    fetchBookings();
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green text-white";
      case "cancelled":
        return "bg-red text-white";
      case "completed":
        return "bg-blue text-white";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Booking Dashboard
        </h1>

        <Input
          placeholder="Search by name or ref..."
          className="max-w-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {["pending", "confirmed", "completed", "cancelled"].map((s) => (
          <Card key={s}>
            <CardContent className="p-4">
              <div className="text-sm text-muted capitalize">{s}</div>
              <div className="text-2xl font-bold">
                {data.filter((d) => d.status === s).length}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-muted animate-pulse rounded"
                />
              ))}
            </div>
          ) : (
            <div className="divide-y">
              {filtered.map((b) => (
                <div
                  key={b.id}
                  onClick={() => setSelected(b)}
                  className="grid grid-cols-5 gap-4 p-4 text-sm hover:bg-muted/40 cursor-pointer transition"
                >
                  <div className="font-medium">{b.ref}</div>

                  <div>
                    {b.firstName} {b.lastName}
                  </div>

                  <div className="capitalize">{b.service}</div>

                  <div>{b.phone}</div>

                  <div className="flex justify-between items-center">
                    <Badge className={statusColor(b.status)}>
                      {b.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* DRAWER */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
          <div className="w-full max-w-md bg-white h-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Booking Details</h2>
              <button onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className="text-sm space-y-2">
              <p><b>Ref:</b> {selected.ref}</p>
              <p><b>Name:</b> {selected.firstName} {selected.lastName}</p>
              <p><b>Service:</b> {selected.service}</p>
              <p><b>Phone:</b> {selected.phone}</p>
              <p><b>Email:</b> {selected.email}</p>
              <p><b>Location:</b> {selected.location}</p>
              <p><b>Notes:</b> {selected.notes || "None"}</p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={() =>
                  updateStatus(selected.id, "confirmed")
                }
              >
                Confirm
              </Button>

              <Button
                variant="secondary"
                onClick={() =>
                  updateStatus(selected.id, "completed")
                }
              >
                Complete
              </Button>

              <Button
                variant="destructive"
                onClick={() =>
                  updateStatus(selected.id, "cancelled")
                }
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}