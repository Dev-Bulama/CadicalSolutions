"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Calendar, Wrench, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"]

// Mock scheduled jobs
const SCHEDULED = {
  "2026-05-19": [{ id: "j1", equipment: "GE Ultrasound", type: "REPAIR", urgency: "URGENT" }],
  "2026-05-22": [{ id: "j2", equipment: "Philips Ventilator", type: "MAINTENANCE", urgency: "NORMAL" }],
  "2026-05-25": [
    { id: "j3", equipment: "X-Ray Machine", type: "CALIBRATION", urgency: "ROUTINE" },
    { id: "j4", equipment: "ECG Monitor", type: "INSPECTION", urgency: "NORMAL" },
  ],
}

const URGENCY_DOT: Record<string, string> = {
  EMERGENCY: "bg-red-500",
  URGENT: "bg-amber-500",
  NORMAL: "bg-blue-500",
  ROUTINE: "bg-muted-foreground",
}

export default function TechnicianSchedulePage() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState(today.getDate())

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }

  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  function dateKey(d: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
  }

  const selectedKey = dateKey(selectedDay)
  const selectedJobs = SCHEDULED[selectedKey as keyof typeof SCHEDULED] || []

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">My Schedule</h1>

      {/* Calendar */}
      <Card>
        <CardContent className="p-4">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-muted">
              <ChevronLeft size={18} />
            </button>
            <p className="font-semibold text-sm">{MONTH_NAMES[month]} {year}</p>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-muted">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d} className="text-center text-xs text-muted-foreground py-1 font-medium">{d}</div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = i + 1
              const key = dateKey(d)
              const jobs = SCHEDULED[key as keyof typeof SCHEDULED] || []
              const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear()
              const isSelected = d === selectedDay

              return (
                <button
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={cn(
                    "aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-colors relative",
                    isSelected ? "bg-primary text-primary-foreground" :
                    isToday ? "bg-primary/10 text-primary font-semibold" :
                    "hover:bg-muted"
                  )}
                >
                  <span>{d}</span>
                  {jobs.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5">
                      {jobs.slice(0, 3).map((j) => (
                        <div
                          key={j.id}
                          className={cn(
                            "w-1 h-1 rounded-full",
                            isSelected ? "bg-primary-foreground" : URGENCY_DOT[j.urgency]
                          )}
                        />
                      ))}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected day jobs */}
      <div>
        <h2 className="text-sm font-semibold mb-2">
          {MONTH_NAMES[month]} {selectedDay}, {year}
          {selectedJobs.length > 0 && (
            <Badge variant="secondary" className="ml-2 text-[10px]">{selectedJobs.length} job{selectedJobs.length !== 1 ? "s" : ""}</Badge>
          )}
        </h2>

        {selectedJobs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <Calendar size={24} className="mx-auto mb-2 opacity-40" />
            No jobs scheduled for this day
          </div>
        ) : (
          <div className="space-y-2">
            {selectedJobs.map((job) => (
              <Card key={job.id}>
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Wrench size={14} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{job.equipment}</p>
                    <p className="text-xs text-muted-foreground">{job.type.replace(/_/g, " ")}</p>
                  </div>
                  <div className={cn("w-2 h-2 rounded-full", URGENCY_DOT[job.urgency])} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
