"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, XCircle } from "lucide-react"
import { toast } from "sonner"

interface FailedJob {
  id: string
  entity: string
  operation: string
  errorMessage: string
  retryCount: number
  maxRetries: number
  status: string
  createdAt: string
}

export default function FailedJobsPage() {
  const [jobs, setJobs] = useState<FailedJob[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchJobs() }, [])

  async function fetchJobs() {
    setLoading(true)
    const res = await fetch("/api/admin/crm/failed-jobs")
    const data = await res.json()
    setJobs(data.jobs || [])
    setLoading(false)
  }

  async function retryJob(id: string) {
    const res = await fetch("/api/admin/crm/failed-jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    const data = await res.json()
    if (data.success) {
      toast.success(data.message || "Retry queued")
    } else {
      toast.error(data.message || "Retry failed")
    }
    await fetchJobs()
  }

  return (
    <div className="p-6 max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Failed Jobs</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Sync operations that failed. Retry or dismiss individually.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchJobs}>
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardContent className="pt-4">
          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-12">Loading failed jobs…</p>
          ) : jobs.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <XCircle size={24} className="text-emerald-500" />
              </div>
              <p className="font-medium text-sm">No failed jobs</p>
              <p className="text-muted-foreground text-xs mt-1">All sync operations are healthy.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {jobs.map((job) => (
                <div key={job.id} className="flex items-start gap-3 p-4 rounded-lg border border-red-100 bg-red-50/50">
                  <XCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium capitalize">{job.entity}</span>
                      <Badge variant="outline" className="text-[10px] capitalize">{job.operation}</Badge>
                      <Badge variant="secondary" className="text-[10px]">
                        Retry {job.retryCount}/{job.maxRetries}
                      </Badge>
                      <Badge
                        variant={job.status === "abandoned" ? "destructive" : "secondary"}
                        className="text-[10px]"
                      >
                        {job.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-red-700 mt-1 truncate">{job.errorMessage}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(job.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {job.status !== "abandoned" && job.retryCount < job.maxRetries && (
                    <Button size="sm" variant="outline" onClick={() => retryJob(job.id)} className="shrink-0">
                      <RefreshCw size={13} />
                      Retry
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
