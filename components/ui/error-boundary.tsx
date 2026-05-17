"use client"

import { Component, type ReactNode } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, message: "" }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error) {
    console.error("[ErrorBoundary]", error)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 text-center p-8">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle size={22} className="text-red-500" />
          </div>
          <div>
            <p className="font-semibold">Something went wrong</p>
            <p className="text-sm text-muted-foreground mt-1">{this.state.message || "An unexpected error occurred."}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => this.setState({ hasError: false, message: "" })}>
            Try again
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}

export function PageError({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 text-center p-8">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
        <AlertTriangle size={22} className="text-red-500" />
      </div>
      <div>
        <p className="font-semibold">Failed to load data</p>
        <p className="text-sm text-muted-foreground mt-1">{message || "Please check your connection and try again."}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  )
}
