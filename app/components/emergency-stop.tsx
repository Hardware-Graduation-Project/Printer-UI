"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { printerApi } from "../APIs/MonitoringApis";

export function EmergencyStop() {
  const [printerState, setPrinterState] = useState<string>("ready");
  const [isStoppingPrint, setIsStoppingPrint] = useState(false);
  const [isRestartingFirmware, setIsRestartingFirmware] = useState(false);
  const alarmSound = new Audio("/sounds/alarm.mp3");

  // Check printer status on component mount
  useEffect(() => {
    checkPrinterStatus();
  }, []);

  const checkPrinterStatus = async () => {
    try {
      const mcuStatusResponse = await printerApi.getMcuStatus();
      if (mcuStatusResponse.success && mcuStatusResponse.data) {
        const status = mcuStatusResponse.data?.result.state;
        setPrinterState(status);
        console.log("Current printer status:", status);
      }
    } catch (error) {
      console.error("Error checking printer status:", error);
    }
  };

  const handleEmergencyStop = async () => {
    setIsStoppingPrint(true);
    const alarmSound = new Audio("/sounds/alarm.mp3");
    alarmSound.play().catch((err) => {
      console.warn("Audio playback failed:", err);
    });

    try {
      // Keep sending emergency stop until status is not printing
      let currentStatus = printerState;

      while (currentStatus !== "shutdown" && currentStatus !== "standby") {
        try {
          const response = await printerApi.emergencyStop();
          console.log("Emergency stop sent:", response);

          // Wait a bit before checking status
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Check status again
          const mcuStatusResponse = await printerApi.getMcuStatus();
          if (mcuStatusResponse.success && mcuStatusResponse.data) {
            currentStatus = mcuStatusResponse.data?.result.state;
            console.log("MCU Status after emergency stop:", mcuStatusResponse);
            console.log("Current status:", currentStatus);
          }
        } catch (error) {
          console.error("Error during emergency stop iteration:", error);
          break;
        }
      }

      setPrinterState(currentStatus);
      alert(`Emergency stop completed. Printer status: ${currentStatus}`);
    } catch (error) {
      console.error("Error during emergency stop:", error);
      alert("Failed to initiate emergency stop. Please try again.");
    } finally {
      setIsStoppingPrint(false);
    }
  };

  const handleRestartFirmware = async () => {
    setIsRestartingFirmware(true);

    try {
      const response = await printerApi.restartFirmware();
      if (response.success) {
        alert("Firmware restart initiated successfully.");

        // Keep checking status until printer is ready or starts printing
        const checkStatusInterval = setInterval(async () => {
          try {
            const mcuStatusResponse = await printerApi.getMcuStatus();
            if (mcuStatusResponse.success && mcuStatusResponse.data) {
              const status = mcuStatusResponse.data?.result.state;
              console.log("Checking status after firmware restart:", status);
              setPrinterState(status);

              // Stop checking when printer is ready or printing (both valid states to exit restart mode)
              if (status !== "shutdown") {
                clearInterval(checkStatusInterval);
                setIsRestartingFirmware(false);
                console.log(
                  `Printer status is now: ${status}. ${
                    status === "printing"
                      ? "Returning to emergency stop mode"
                      : "Firmware restart complete"
                  }`
                );
              }
            }
          } catch (statusError) {
            console.error(
              "Error checking status after firmware restart:",
              statusError
            );
          }
        }, 1000); // Check every second

        // Safety timeout - stop checking after 30 seconds
        setTimeout(() => {
          clearInterval(checkStatusInterval);
          setIsRestartingFirmware(false);
          console.log(
            "Firmware restart timeout reached, stopping status checks"
          );
        }, 30000);
      }
    } catch (error) {
      console.error("Error during firmware restart:", error);
      alert("Failed to restart firmware. Please try again.");
      setIsRestartingFirmware(false);
    }
  };
  return (
    <>
      {printerState !== "shutdown" ? (
        <Button
          size="lg"
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 text-lg shadow-lg"
          onClick={handleEmergencyStop}
          disabled={isStoppingPrint}
        >
          🛑
          {isStoppingPrint ? "STOPPING..." : "EMERGENCY STOP"}
        </Button>
      ) : (
        <Button
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 text-lg shadow-lg"
          onClick={handleRestartFirmware}
          disabled={isRestartingFirmware}
        >
          {isRestartingFirmware ? "🔄 RESTARTING..." : "🔄 RESTART FIRMWARE"}
        </Button>
      )}
    </>
  );
}
