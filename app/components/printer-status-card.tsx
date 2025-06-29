"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePrinterAPI } from "../hooks/usePrinterAPI";
import { usePrinterStatus } from "../contexts/PrinterStatusContext";
import { RefreshCw, Wifi, WifiOff } from "lucide-react";

// TOD: Fix status
export function PrinterStatusCard() {
  const { refreshStatus, isConnected } = usePrinterAPI();
  const { state } = usePrinterStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="w-5 h-5 text-green-500" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-500" />
            )}
            Printer Status
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshStatus}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Connection</span>
          <Badge variant={isConnected ? "default" : "destructive"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>

        {/* MCU Status */}
        {isConnected && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">MCU Status</span>
            <Badge variant="outline">{state.mcuState.state}</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
