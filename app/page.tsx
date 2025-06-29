"use client";

import { useState } from "react";
import { Sidebar } from "./components/sidebar";
import { GCodeUpload } from "./components/gcode-upload";
import { MotorControl } from "./components/motor-control";
import { EmergencyStop } from "./components/emergency-stop";
import { RealtimeMonitoring } from "./components/realtime-monitoring";
import { ForceSensor } from "./components/force-sensor";
import { ErrorDetection } from "./components/error-detection";
import { GCodeConsole } from "./components/gcode-console";
import { PrintHistory } from "./components/print-history";
import { PrinterControlDemo } from "./components/printer-control-demo";
import { PrinterStatusCard } from "./components/printer-status-card";

export default function Dashboard() {
  const [errorModalOpen, setErrorModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          <main className="p-6 space-y-6">
            {/* Emergency Stop - Fixed position */}
            <div className="fixed top-3 right-6 z-50">
              <EmergencyStop />
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <PrinterStatusCard />
                <MotorControl />
                <ForceSensor />
              </div>

              {/* Middle Column */}
              <div className="space-y-6">
                <RealtimeMonitoring />
                <PrinterControlDemo />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <GCodeConsole />
                <GCodeUpload />
              </div>
            </div>

            {/* Full Width Section */}
            <ErrorDetection
              open={errorModalOpen}
              onOpenChange={setErrorModalOpen}
            />
            <PrintHistory />
          </main>
        </div>
      </div>
    </div>
  );
}
