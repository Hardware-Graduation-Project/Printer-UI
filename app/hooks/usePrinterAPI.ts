"use client";

import { useEffect, useCallback } from "react";
import { usePrinterStatus } from "../contexts/PrinterStatusContext";
import { PrinterStatus, McuStatusResponse } from "../APIs/types";
import { printerApi } from "../APIs/MonitoringApis";

// API function using real monitoring APIs
const fetchPrinterStatus = async (): Promise<PrinterStatus> => {
  const response = await printerApi.getPrinterStatus();
  if (!response.success || !response.data) {
    throw new Error(response.message || "Failed to fetch printer status");
  }
  return response.data;
};

// API function to fetch MCU status
const fetchMcuStatus = async (): Promise<McuStatusResponse> => {
  const response = await printerApi.getMcuStatus();
  if (!response.success || !response.data) {
    throw new Error(response.message || "Failed to fetch MCU status");
  }
  return response.data;
};

export function usePrinterAPI() {
  const {
    updateFullStatus,
    updateMcuStatus,
    setConnectionStatus,
    updateProgress,
    updateTime,
    state,
  } = usePrinterStatus();

  const fetchAndUpdateStatus = useCallback(async () => {
    try {
      // Fetch both printer status and MCU status
      const [status, mcuStatus] = await Promise.all([
        fetchPrinterStatus(),
        fetchMcuStatus(),
      ]);

      updateFullStatus(status);
      updateMcuStatus(mcuStatus);
      setConnectionStatus(true);

      // Calculate progress if printing
      if (status.result.status.print_stats.state === "printing") {
        const { print_duration, total_duration } =
          status.result.status.print_stats;
        if (total_duration > 0) {
          const progressPercent = (print_duration / total_duration) * 100;
          updateProgress(progressPercent);

          // Format time strings
          const elapsed = formatTime(print_duration);
          const remaining = formatTime(total_duration - print_duration);
          updateTime(elapsed, remaining);
        }
      }
    } catch (error) {
      console.error("Failed to fetch printer status:", error);
      setConnectionStatus(false);
    }
  }, []);

  // Auto-refresh printer status
  useEffect(() => {
    // Initial fetch
    fetchAndUpdateStatus();

    // Set up polling interval (adjust frequency as needed)
    const interval = setInterval(fetchAndUpdateStatus, 3000); // Every 3 seconds

    return () => clearInterval(interval);
  }, [fetchAndUpdateStatus]);

  // Manual refresh function
  const refreshStatus = useCallback(() => {
    fetchAndUpdateStatus();
  }, [fetchAndUpdateStatus]);

  // Separate function to refresh only MCU status
  const refreshMcuStatus = useCallback(async () => {
    try {
      const mcuStatus = await fetchMcuStatus();
      updateMcuStatus(mcuStatus);
    } catch (error) {
      console.error("Failed to fetch MCU status:", error);
    }
  }, [updateMcuStatus]);

  return {
    refreshStatus,
    refreshMcuStatus,
    isConnected: state.isConnected,
    lastUpdated: state.lastUpdated,
  };
}

// Helper function to format seconds into HH:MM:SS
function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
