export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
}

export interface McuStatusResponse {
  result: {
    state: "ready" | "startup" | "shutdown" | "error" | "printing" | "paused";
    state_message: string;
    hostname: string;
    klipper_path: string;
    python_path: string;
    process_id: number;
    user_id: number;
    group_id: number;
    log_file: string;
    config_file: string;
    software_version: string;
    cpu_info: string;
  };
}

export interface PrinterStatus {
  result: {
    status: {
      print_stats: {
        state:
          | "ready"
          | "printing"
          | "paused"
          | "complete"
          | "cancelled"
          | "error"
          | "standby";
        filename: string;
        total_duration: number;
        print_duration: number;
        filament_used: number;
      };
      toolhead: {
        homed_axes: string;
        position: [number, number, number, number]; // [x, y, z, e]
        print_time: number;
        estimated_print_time: number;
      };
      extruder: {
        temperature: number;
        target: number;
        power: number;
      };
    };
  };
}
