"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle, CheckCircle, Pause, RotateCcw, Settings } from "lucide-react"

interface ErrorAlert {
  id: string
  type: "warning" | "error" | "info"
  message: string
  timestamp: string
}

interface ErrorDetectionProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ErrorDetection({ open, onOpenChange }: ErrorDetectionProps) {
  const [errors] = useState<ErrorAlert[]>([
    {
      id: "1",
      type: "warning",
      message: "Extruder temperature slightly below target",
      timestamp: "2 min ago",
    },
    {
      id: "2",
      type: "error",
      message: "Layer adhesion issue detected",
      timestamp: "5 min ago",
    },
  ])

  const [selectedError, setSelectedError] = useState<ErrorAlert | null>(null)

  const getErrorColor = (type: string) => {
    switch (type) {
      case "error":
        return "bg-red-500"
      case "warning":
        return "bg-yellow-500"
      case "info":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleErrorClick = (error: ErrorAlert) => {
    setSelectedError(error)
    onOpenChange(true)
  }

  const handlePausePrint = () => {
    console.log("Pausing print...")
    onOpenChange(false)
  }

  const handleRetry = () => {
    console.log("Retrying...")
    onOpenChange(false)
  }

  const handleManualOverride = () => {
    console.log("Manual override activated...")
    onOpenChange(false)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Error Detection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {errors.length === 0 ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span>No active alerts</span>
            </div>
          ) : (
            errors.map((error) => (
              <div
                key={error.id}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleErrorClick(error)}
              >
                <Badge className={`${getErrorColor(error.type)} text-white mt-0.5`}>{error.type}</Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{error.message}</p>
                  <p className="text-xs text-gray-500">{error.timestamp}</p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Error Detected
            </DialogTitle>
            <DialogDescription>{selectedError?.message}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-800 mb-2">Recommended Actions:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Check material feed and nozzle condition</li>
                <li>• Verify bed leveling and adhesion</li>
                <li>• Monitor temperature stability</li>
              </ul>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handlePausePrint}>
              <Pause className="w-4 h-4 mr-2" />
              Pause Print
            </Button>
            <Button variant="outline" onClick={handleRetry}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Retry
            </Button>
            <Button onClick={handleManualOverride}>
              <Settings className="w-4 h-4 mr-2" />
              Manual Override
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
