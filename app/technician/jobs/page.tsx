"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin, Clock, Wrench, AlertTriangle, CheckCircle,
  ChevronRight, Phone, User, Package,
} from "lucide-react"
import Link from "next/link"

const MOCK_JOBS = [
  {
    id: "j1",
    jobCode: "JOB-ABC123",
    status: "ASSIGNED",
    booking: {
      bookingCode: "SB-XYZ",
      equipmentName: "GE Ultrasound Machine",
      serviceType: "REPAIR",
      urgency: "URGENT",
      siteAddress: "12 Marina Street",
      siteCity: "Lagos",
      siteState: "Lagos",
      issueDescription: "Machine not powering on, display blank",
      user: { name: "Dr. Chukwu Emeka", phone: "+234 801 234 5678" },
    },
    scheduledAt: new Date(Date.now() + 86400000).toISOString(),
  },
  {
    id: "j2",
    jobCode: "JOB-DEF456",
    status: "IN_PROGRESS",
    booking: {
      bookingCode: "SB-ABC",
      equipmentName: "Philips Ventilator",
      serviceType: "PREVENTIVE_MAINTENANCE",
      urgency: "NORMAL",
      siteAddress: "5 Broad Street",
      siteCity: "Abuja",
      siteState: "FCT",
      issueDescription: "Scheduled quarterly maintenance",
      user: { name: "Lagos General Hospital", phone: "+234 702 345 6789" },
    },
    scheduledAt: new Date().toISOString(),
  },
  {
    id: "j3",
    jobCode: "JOB-GHI789",
    status: "COMPLETED",
    booking: {
      bookingCode: "SB-DEF",
      equipmentName: "Siemens X-Ray Machine",
      serviceType: "CALIBRATION",
      urgency: "ROUTINE",
      siteAddress: "Hospital Road",
      siteCity: "Port Harcourt",
      siteState: "Rivers",
      issueDescription: "Annual calibration",
      user: { name: "Rivers State Hospital", phone: "+234 803 456 7890" },
    },
    scheduledAt: new Date(Date.now() - 86400000).toISOString(),
  },
]

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  ASSIGNED: { label: "Assigned", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  ACCEPTED: { label: "Accepted", color: "text-violet-700", bg: "bg-violet-50 border-violet-200" },
  EN_ROUTE: { label: "En Route", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  ON_SITE: { label: "On Site", color: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
  IN_PROGRESS: { label: "In Progress", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  WAITING_PARTS: { label: "Waiting Parts", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  COMPLETED: { label: "Completed", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  REJECTED: { label: "Rejected", color: "text-red-700", bg: "bg-red-50 border-red-200" },
}

const URGENCY_ICON: Record<string, React.ReactNode> = {
  EMERGENCY: <AlertTriangle size={13} className="text-red-500" />,
  URGENT: <AlertTriangle size={13} className="text-amber-500" />,
  NORMAL: <Clock size={13} className="text-blue-500" />,
  ROUTINE: <Clock size={13} className="text-muted-foreground" />,
}

export default function TechnicianJobsPage() {
  const [activeTab, setActiveTab] = useState("active")

  const active = MOCK_JOBS.filter((j) => !["COMPLETED", "CANCELLED", "REJECTED"].includes(j.status))
  const completed = MOCK_JOBS.filter((j) => j.status === "COMPLETED")

  function JobCard({ job }: { job: typeof MOCK_JOBS[0] }) {
    const sc = STATUS_CONFIG[job.status] || STATUS_CONFIG.ASSIGNED
    return (
      <Card className="mb-3 active:scale-[0.99] transition-transform">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              {URGENCY_ICON[job.booking.urgency]}
              <code className="text-xs text-muted-foreground">{job.jobCode}</code>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${sc.color} ${sc.bg}`}>
              {sc.label}
            </span>
          </div>

          <h3 className="font-semibold text-sm mb-1">{job.booking.equipmentName}</h3>
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{job.booking.issueDescription}</p>

          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
            <MapPin size={11} />
            <span>{job.booking.siteAddress}, {job.booking.siteCity}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <User size={11} />
            <span>{job.booking.user.name}</span>
          </div>

          {job.scheduledAt && (
            <div className="mt-2 p-2 bg-muted rounded-md flex items-center gap-1.5 text-xs">
              <Clock size={11} />
              <span>Scheduled: {new Date(job.scheduledAt).toLocaleString()}</span>
            </div>
          )}

          <div className="flex gap-2 mt-3">
            {job.status === "ASSIGNED" && (
              <>
                <Button size="sm" className="flex-1 h-8 text-xs">Accept Job</Button>
                <Button size="sm" variant="outline" className="h-8 text-xs text-red-600 border-red-200 hover:bg-red-50">Decline</Button>
              </>
            )}
            {job.status === "ACCEPTED" && (
              <Button size="sm" className="flex-1 h-8 text-xs">Mark En Route</Button>
            )}
            {job.status === "EN_ROUTE" && (
              <Button size="sm" className="flex-1 h-8 text-xs">Mark On Site</Button>
            )}
            {job.status === "ON_SITE" && (
              <Button size="sm" className="flex-1 h-8 text-xs">Start Work</Button>
            )}
            {job.status === "IN_PROGRESS" && (
              <Button size="sm" className="flex-1 h-8 text-xs">Mark Complete</Button>
            )}
            <Button size="sm" variant="outline" className="h-8 w-8 p-0" asChild>
              <Link href={`/technician/jobs/${job.id}`}>
                <ChevronRight size={14} />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-xl font-bold">My Jobs</h1>
        <p className="text-sm text-muted-foreground">{active.length} active · {completed.length} completed</p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: "Active", value: active.length, color: "text-blue-600" },
          { label: "Today", value: 1, color: "text-amber-600" },
          { label: "Done", value: completed.length, color: "text-emerald-600" },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-xl p-3 text-center border border-border">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-4">
          <TabsTrigger value="active" className="flex-1">Active ({active.length})</TabsTrigger>
          <TabsTrigger value="completed" className="flex-1">Completed ({completed.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          {active.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No active jobs right now
            </div>
          ) : (
            active.map((job) => <JobCard key={job.id} job={job} />)
          )}
        </TabsContent>
        <TabsContent value="completed">
          {completed.map((job) => <JobCard key={job.id} job={job} />)}
        </TabsContent>
      </Tabs>
    </div>
  )
}
