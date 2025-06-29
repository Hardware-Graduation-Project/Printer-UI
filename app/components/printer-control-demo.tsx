"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePrinterStatus } from "../contexts/PrinterStatusContext";
import { Settings, Play, Pause, Square, RotateCcw } from "lucide-react";

export function PrinterControlDemo() {
  const {
    state,
    updateStatus,
    updateProgress,
    updateTime,
    updateFilename,
    setConnectionStatus,
    resetState,
  } = usePrinterStatus();

  const handleStatusChange = (newStatus: typeof state.status) => {
    updateStatus(newStatus);

    // Simulate some realistic changes based on status
    switch (newStatus) {
      case "printing":
        updateFilename("demo_model.gcode");
        updateProgress(Math.random() * 100);
        updateTime("01:23:45", "03:45:12");
        setConnectionStatus(true);
        break;
      case "paused":
        setConnectionStatus(true);
        break;
      case "complete":
        updateProgress(100);
        setConnectionStatus(true);
        break;
      case "error":
        setConnectionStatus(false);
        break;
      default:
        setConnectionStatus(true);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Printer Control Demo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status Display */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="font-medium">Current Status:</span>
          <div className="flex items-center gap-2">
            <Badge variant={state.isConnected ? "default" : "destructive"}>
              {state.isConnected ? "Connected" : "Disconnected"}
            </Badge>
            <Badge>{state.status}</Badge>
          </div>
        </div>

        {/* Quick Status Controls */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange("ready")}
            className="flex items-center gap-2"
          >
            <Square className="w-4 h-4" />
            Ready
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange("printing")}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Start Print
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange("paused")}
            className="flex items-center gap-2"
          >
            <Pause className="w-4 h-4" />
            Pause
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange("complete")}
            className="flex items-center gap-2"
          >
            <Square className="w-4 h-4" />
            Complete
          </Button>
        </div>

        {/* Error and Reset */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleStatusChange("error")}
          >
            Trigger Error
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={resetState}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>

        {/* Status Info */}
        {state.lastUpdated && (
          <div className="text-xs text-gray-500 mt-4">
            Last updated: {state.lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
