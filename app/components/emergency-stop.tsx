"use client";

import { Button } from "@/components/ui/button";
import { emergencyStop } from "../APIs/ControllingAPIs";

export function EmergencyStop() {
  return (
    <>
      <Button
        size="lg"
        className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 text-lg shadow-lg"
        onClick={emergencyStop}
      >
        🛑 EMERGENCY STOP
      </Button>
    </>
  );
}
