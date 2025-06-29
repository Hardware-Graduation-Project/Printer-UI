// Updated TypeScript types for the simplified controller format

import { API_BASE_URL } from "./MonitoringApis";

export interface ControllerSummary {
  controller_id: string;
  controller_name: string;
  created_at: string;
  updated_at: string;
}

export interface SimpleControllerConfig {
  controller_id: string;
  controller_name: string;
  text: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
}

// Service functions for the simplified controller API

export const controllerService = {
  // Get all controllers (summaries)
  getAllControllers: async (): Promise<ControllerSummary[]> => {
    const response = await fetch(`${API_BASE_URL}/api/controllers`);
    if (!response.ok) {
      throw new Error("Failed to fetch controllers");
    }
    const apiResponse: ApiResponse<{ controllers: ControllerSummary[] }> =
      await response.json();
    return apiResponse.data?.controllers || [];
  },

  // Get specific controller details
  getController: async (
    controllerId: string
  ): Promise<SimpleControllerConfig> => {
    const response = await fetch(
      `${API_BASE_URL}/api/controllers/${controllerId}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch controller ${controllerId}`);
    }
    const apiResponse: ApiResponse<{ controller: SimpleControllerConfig }> =
      await response.json();
    if (!apiResponse.data?.controller) {
      throw new Error("Controller not found");
    }
    return apiResponse.data.controller;
  },

  // Get all controller files with full content
  getAllControllerFiles: async () => {
    const response = await fetch(`${API_BASE_URL}/api/controllers/files/all`);
    if (!response.ok) {
      throw new Error("Failed to fetch controller files");
    }
    const apiResponse: ApiResponse = await response.json();
    return apiResponse.data?.controller_files || [];
  },

  // Create new controller (simplified format)
  createController: async (controllerData: {
    controller_name: string;
    text: string;
  }): Promise<SimpleControllerConfig> => {
    const response = await fetch(`${API_BASE_URL}/api/controllers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(controllerData),
    });

    if (!response.ok) {
      throw new Error("Failed to create controller");
    }

    const apiResponse: ApiResponse<{ controller: SimpleControllerConfig }> =
      await response.json();
    return apiResponse.data!.controller;
  },

  // Update controller (simplified format)
  updateController: async (
    controllerId: string,
    updates: {
      controller_name?: string;
      text?: string;
    }
  ): Promise<SimpleControllerConfig> => {
    const response = await fetch(
      `${API_BASE_URL}/api/controllers/${controllerId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update controller ${controllerId}`);
    }

    const apiResponse: ApiResponse<{ controller: SimpleControllerConfig }> =
      await response.json();
    return apiResponse.data!.controller;
  },

  // Delete controller
  deleteController: async (controllerId: string): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/api/controllers/${controllerId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete controller ${controllerId}`);
    }
  },

  // Create default controller
  createDefaultController: async (): Promise<SimpleControllerConfig> => {
    const response = await fetch(`${API_BASE_URL}/api/controllers/default`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to create default controller");
    }

    const apiResponse: ApiResponse<{ controller: SimpleControllerConfig }> =
      await response.json();
    return apiResponse.data!.controller;
  },

  // Set printer config
  setPrinterConfig: async (controllerId: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/printer/set-config`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        controller_id: controllerId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to set printer config: ${response.status}`);
    }

    const result = await response.json();
    return result;
  },
};
