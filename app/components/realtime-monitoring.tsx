"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock } from "lucide-react";
import {
  usePrinterStatus,
  PrintStatus,
} from "../contexts/PrinterStatusContext";

export function RealtimeMonitoring() {
  const { state } = usePrinterStatus();
  const { status, progress, elapsedTime, estimatedTime } = state;

  const getStatusColor = (status: PrintStatus) => {
    switch (status) {
      case "ready":
        return "bg-gray-500";
      case "printing":
        return "bg-green-500";
      case "paused":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      case "complete":
        return "bg-blue-500";
      case "cancelled":
        return "bg-orange-500";
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
