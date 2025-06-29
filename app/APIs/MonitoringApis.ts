import { ApiResponse, McuStatusResponse, PrinterStatus } from "./types";

const API_BASE_URL = "http://localhost:8000";

export const printerApi = {
  getMcuStatus: async (): Promise<ApiResponse<McuStatusResponse>> => {
    const response = await fetch(`${API_BASE_URL}/api/printer/mcu-status`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  getPrinterStatus: async (): Promise<ApiResponse<PrinterStatus>> => {
    const response = await fetch(`${API_BASE_URL}/api/printer/status`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  restartFirmware: async (): Promise<ApiResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/api/printer/restart-firmware`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  emergencyStop: async (): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/printer/emergency-stop`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  homeZAxis: async (): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/printer/home-z`, {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  homeXYAxes: async (): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/printer/home-xy`, {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
};
