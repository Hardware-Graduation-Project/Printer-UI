"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { PrinterStatus, McuStatusResponse } from "../APIs/types";

export type PrintStatus =
  | PrinterStatus["result"]["status"]["print_stats"]["state"]
  | "StanHodby";

export interface PrinterState {
  status: PrintStatus;
  progress: number;
  elapsedTime: string;
  estimatedTime: string;
  filename: string;
  temperatures: {
    extruder: {
      current: number;
      target: number;
    };
  };
  position: {
    x: number;
    y: number;
    z: number;
    e: number;
  };
  mcuState: {
    state: "ready" | "startup" | "shutdown" | "error" | "printing" | "paused";
    stateMessage: string;
    hostname: string;
    klipperPath: string;
    pythonPath: string;
    processId: number;
    userId: number;
    groupId: number;
    logFile: string;
    configFile: string;
    softwareVersion: string;
    cpuInfo: string;
  };
  isConnected: boolean;
  lastUpdated: Date | null;
}

// Action types
type PrinterAction =
  | { type: "UPDATE_STATUS"; payload: PrintStatus }
  | { type: "UPDATE_PROGRESS"; payload: number }
  | { type: "UPDATE_TIME"; payload: { elapsed: string; estimated: string } }
  | { type: "UPDATE_FILENAME"; payload: string }
  | {
      type: "UPDATE_TEMPERATURES";
      payload: { current: number; target: number };
    }
  | {
      type: "UPDATE_POSITION";
      payload: { x: number; y: number; z: number; e: number };
    }
  | { type: "SET_CONNECTION_STATUS"; payload: boolean }
  | { type: "UPDATE_FULL_STATUS"; payload: PrinterStatus }
  | { type: "UPDATE_MCU_STATUS"; payload: McuStatusResponse }
  | { type: "RESET_STATE" };

// Initial state
const initialState: PrinterState = {
  status: "StanHodby",
  progress: 0,
  elapsedTime: "00:00:00",
  estimatedTime: "00:00:00",
  filename: "",
  temperatures: {
    extruder: {
      current: 0,
      target: 0,
    },
  },
  position: {
    x: 0,
    y: 0,
    z: 0,
    e: 0,
  },
  mcuState: {
    state: "ready",
    stateMessage: "",
    hostname: "",
    klipperPath: "",
    pythonPath: "",
    processId: 0,
    userId: 0,
    groupId: 0,
    logFile: "",
    configFile: "",
    softwareVersion: "",
    cpuInfo: "",
  },
  isConnected: false,
  lastUpdated: null,
};

// Reducer function
function printerReducer(
  state: PrinterState,
  action: PrinterAction
): PrinterState {
  switch (action.type) {
    case "UPDATE_STATUS":
      return {
        ...state,
        status: action.payload,
        lastUpdated: new Date(),
      };

    case "UPDATE_PROGRESS":
      return {
        ...state,
        progress: action.payload,
        lastUpdated: new Date(),
      };

    case "UPDATE_TIME":
      return {
        ...state,
        elapsedTime: action.payload.elapsed,
        estimatedTime: action.payload.estimated,
        lastUpdated: new Date(),
      };

    case "UPDATE_FILENAME":
      return {
        ...state,
        filename: action.payload,
        lastUpdated: new Date(),
      };

    case "UPDATE_TEMPERATURES":
      return {
        ...state,
        temperatures: {
          ...state.temperatures,
          extruder: action.payload,
        },
        lastUpdated: new Date(),
      };

    case "UPDATE_POSITION":
      return {
        ...state,
        position: action.payload,
        lastUpdated: new Date(),
      };

    case "SET_CONNECTION_STATUS":
      return {
        ...state,
        isConnected: action.payload,
        lastUpdated: new Date(),
      };

    case "UPDATE_FULL_STATUS":
      const printerStatus = action.payload.result.status;
      return {
        ...state,
        status: printerStatus.print_stats.state,
        filename: printerStatus.print_stats.filename,
        temperatures: {
          extruder: {
            current: printerStatus.extruder.temperature,
            target: printerStatus.extruder.target,
          },
        },
        position: {
          x: printerStatus.toolhead.position[0],
          y: printerStatus.toolhead.position[1],
          z: printerStatus.toolhead.position[2],
          e: printerStatus.toolhead.position[3],
        },
        lastUpdated: new Date(),
      };

    case "UPDATE_MCU_STATUS":
      const mcuStatus = action.payload.result;
      return {
        ...state,
        mcuState: {
          state: mcuStatus.state,
          stateMessage: mcuStatus.state_message,
          hostname: mcuStatus.hostname,
          klipperPath: mcuStatus.klipper_path,
          pythonPath: mcuStatus.python_path,
          processId: mcuStatus.process_id,
          userId: mcuStatus.user_id,
          groupId: mcuStatus.group_id,
          logFile: mcuStatus.log_file,
          configFile: mcuStatus.config_file,
          softwareVersion: mcuStatus.software_version,
          cpuInfo: mcuStatus.cpu_info,
        },
        lastUpdated: new Date(),
      };

    case "RESET_STATE":
      return initialState;

    default:
      return state;
  }
}

// Context type
interface PrinterContextType {
  state: PrinterState;
  updateStatus: (status: PrintStatus) => void;
  updateProgress: (progress: number) => void;
  updateTime: (elapsed: string, estimated: string) => void;
  updateFilename: (filename: string) => void;
  updateTemperatures: (current: number, target: number) => void;
  updatePosition: (x: number, y: number, z: number, e: number) => void;
  setConnectionStatus: (connected: boolean) => void;
  updateFullStatus: (status: PrinterStatus) => void;
  updateMcuStatus: (mcuStatus: McuStatusResponse) => void;
  resetState: () => void;
}

// Create context
const PrinterContext = createContext<PrinterContextType | undefined>(undefined);

// Provider component
interface PrinterProviderProps {
  children: ReactNode;
}

export function PrinterProvider({ children }: PrinterProviderProps) {
  const [state, dispatch] = useReducer(printerReducer, initialState);

  // Action creators
  const updateStatus = (status: PrintStatus) => {
    dispatch({ type: "UPDATE_STATUS", payload: status });
  };

  const updateProgress = (progress: number) => {
    dispatch({ type: "UPDATE_PROGRESS", payload: progress });
  };

  const updateTime = (elapsed: string, estimated: string) => {
    dispatch({ type: "UPDATE_TIME", payload: { elapsed, estimated } });
  };

  const updateFilename = (filename: string) => {
    dispatch({ type: "UPDATE_FILENAME", payload: filename });
  };

  const updateTemperatures = (current: number, target: number) => {
    dispatch({ type: "UPDATE_TEMPERATURES", payload: { current, target } });
  };

  const updatePosition = (x: number, y: number, z: number, e: number) => {
    dispatch({ type: "UPDATE_POSITION", payload: { x, y, z, e } });
  };

  const setConnectionStatus = (connected: boolean) => {
    dispatch({ type: "SET_CONNECTION_STATUS", payload: connected });
  };

  const updateFullStatus = (status: PrinterStatus) => {
    dispatch({ type: "UPDATE_FULL_STATUS", payload: status });
  };

  const updateMcuStatus = (mcuStatus: McuStatusResponse) => {
    dispatch({ type: "UPDATE_MCU_STATUS", payload: mcuStatus });
  };

  const resetState = () => {
    dispatch({ type: "RESET_STATE" });
  };

  // Simulate progress updates when printing
  useEffect(() => {
    if (state.status === "printing") {
      const interval = setInterval(() => {
        if (state.progress < 100) {
          updateProgress(Math.min(state.progress + 0.1, 100));
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [state.status, state.progress]);

  const value: PrinterContextType = {
    state,
    updateStatus,
    updateProgress,
    updateTime,
    updateFilename,
    updateTemperatures,
    updatePosition,
    setConnectionStatus,
    updateFullStatus,
    updateMcuStatus,
    resetState,
  };

  return (
    <PrinterContext.Provider value={value}>{children}</PrinterContext.Provider>
  );
}

// Custom hook to use the context
export function usePrinterStatus() {
  const context = useContext(PrinterContext);
  if (context === undefined) {
    throw new Error("usePrinterStatus must be used within a PrinterProvider");
  }
  return context;
}

// Types are already exported above, no need to re-export
