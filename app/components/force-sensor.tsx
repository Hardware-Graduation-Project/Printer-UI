"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gauge, TrendingUp, TrendingDown } from "lucide-react"

export function ForceSensor() {
  const [currentForce, setCurrentForce] = useState(2.34)
  const [maxForce, setMaxForce] = useState(5.67)
  const [trend, setTrend] = useState<"up" | "down" | "stable">("stable")

  // Simulate real-time force readings
  useEffect(() => {
    const interval = setInterval(() => {
      const newForce = 2 + Math.random() * 4 // Random force between 2-6 N
      const prevForce = currentForce

      setCurrentForce(newForce)
      setMaxForce((prev) => Math.max(prev, newForce))

      if (newForce > prevForce + 0.1) {
        setTrend("up")
      } else if (newForce < prevForce - 0.1) {
        setTrend("down")
      } else {
        setTrend("stable")
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [currentForce])

  const getForceColor = (force: number) => {
    if (force < 3) return "text-green-600"
    if (force < 5) return "text-yellow-600"
    return "text-red-600"
  }

  const getForceStatus = (force: number) => {
    if (force < 3) return { status: "Normal", color: "bg-green-500" }
    if (force < 5) return { status: "Elevated", color: "bg-yellow-500" }
    return { status: "High", color: "bg-red-500" }
  }

  const forceStatus = getForceStatus(currentForce)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="w-5 h-5" />
          Force Sensor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Reading */}
        <div className="text-center space-y-2">
          <div className={`text-4xl font-bold ${getForceColor(currentForce)}`}>
            {currentForce.toFixed(2)}
            <span className="text-lg text-gray-500 ml-1">N</span>
          </div>
          <Badge className={`${forceStatus.color} text-white`}>{forceStatus.status}</Badge>
        </div>

        {/* Visual Gauge */}
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all duration-300 ${
                currentForce < 3 ? "bg-green-500" : currentForce < 5 ? "bg-yellow-500" : "bg-red-500"
              }`}
              style={{ width: `${Math.min((currentForce / 8) * 100, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0N</span>
            <span>4N</span>
            <span>8N</span>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div>
            <div className="text-sm text-gray-600">Max Force</div>
            <div className="text-lg font-semibold">{maxForce.toFixed(2)}N</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 flex items-center gap-1">
              Trend
              {trend === "up" && <TrendingUp className="w-3 h-3 text-red-500" />}
              {trend === "down" && <TrendingDown className="w-3 h-3 text-green-500" />}
            </div>
            <div className="text-lg font-semibold capitalize">{trend}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
