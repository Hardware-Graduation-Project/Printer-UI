"use client";

import { Button } from "@/components/ui/button";

export function EmergencyStop() {
  const handleEmergencyStop = () => {
    // Implement emergency stop logic
    console.log("EMERGENCY STOP ACTIVATED");
  };

  return (
    <>
      <Button
        size="lg"
        className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 text-lg shadow-lg"
        onClick={handleEmergencyStop}
      >
        🛑 EMERGENCY STOP
      </Button>
    </>
  );
}
