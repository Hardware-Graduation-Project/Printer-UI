"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock, Code } from "lucide-react";

type PrintStatus = "Idle" | "Printing" | "Paused" | "Error";

export function RealtimeMonitoring() {
  const [progress, setProgress] = useState(67);
  const [status, setStatus] = useState<PrintStatus>("Printing");
  const [elapsedTime, setElapsedTime] = useState("02:34:12");
  const [estimatedTime, setEstimatedTime] = useState("03:45:00");

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (status === "Printing") {
        setProgress((prev) => Math.min(prev + 0.1, 100));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  const getStatusColor = (status: PrintStatus) => {
    switch (status) {
      case "Idle":
        return "bg-gray-500";
      case "Printing":
        return "bg-green-500";
      case "Paused":
        return "bg-yellow-500";
      case "Error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Real-Time Monitoring
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status</span>
          <Badge className={`${getStatusColor(status)} text-white`}>
            {status}
          </Badge>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Print Progress</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Time Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              Elapsed
            </div>
            <div className="font-mono text-lg font-semibold">{elapsedTime}</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              Estimated
            </div>
            <div className="font-mono text-lg font-semibold">
              {estimatedTime}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
