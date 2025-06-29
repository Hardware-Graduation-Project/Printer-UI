"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { printerApi } from "@/app/APIs/MonitoringApis";
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Home,
  Settings,
  Loader2,
  X,
  AlertCircle,
} from "lucide-react";

interface MotorPositions {
  x: number;
  y: number;
  z: number;
  extruder: number;
  syringe: number;
}

export function MotorControl() {
  const [positions, setPositions] = useState<MotorPositions>({
    x: 0,
    y: 0,
    z: 0,
    extruder: 0,
    syringe: 0,
  });

  const [stepSizes, setStepSizes] = useState({
    xy: 1,
    z: 0.1,
    extruder: 5,
  });

  const [isHoming, setIsHoming] = useState({
    xy: false,
    z: false,
    all: false,
  });

  const [snackbar, setSnackbar] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbar({ show: true, message, type });
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setSnackbar((prev) => ({ ...prev, show: false }));
    }, 5000);
  };

  const hideSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, show: false }));
  };

  const moveMotor = (
    axis: keyof MotorPositions,
    direction: number,
    distance?: number
  ) => {
    let stepSize = distance;
    if (!stepSize) {
      if (axis === "x" || axis === "y") stepSize = stepSizes.xy;
      else if (axis === "z") stepSize = stepSizes.z;
      else if (axis === "extruder" || axis === "syringe")
        stepSize = stepSizes.extruder;
      else stepSize = 1;
    }

    setPositions((prev) => ({
      ...prev,
      [axis]: prev[axis] + direction * stepSize,
    }));
  };

  const homeXY = async () => {
    setIsHoming((prev) => ({ ...prev, xy: true }));
    try {
      const response = await printerApi.homeXYAxes();
      if (response.success) {
        setPositions((prev) => ({
          ...prev,
          x: 0,
          y: 0,
        }));
        showSnackbar("XY axes homed successfully", "success");
      } else {
        // API returned success: false
        const errorMessage =
          response.message || "Unknown error occurred while homing XY axes";
        console.error("XY homing failed:", errorMessage);
        showSnackbar(errorMessage, "error");
      }
    } catch (error) {
      // Network error or other exception
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Network error or connection failed";
      console.error("Failed to home XY axes:", error);
      showSnackbar(`Failed to home XY axes: ${errorMessage}`, "error");
    } finally {
      setIsHoming((prev) => ({ ...prev, xy: false }));
    }
  };

  const homeZ = async () => {
    setIsHoming((prev) => ({ ...prev, z: true }));
    try {
      const response = await printerApi.homeZAxis();
      if (response.success) {
        setPositions((prev) => ({
          ...prev,
          z: 0,
        }));
        showSnackbar("Z axis homed successfully", "success");
      } else {
        // API returned success: false
        const errorMessage =
          response.message || "Unknown error occurred while homing Z axis";
        console.error("Z homing failed:", errorMessage);
        showSnackbar(errorMessage, "error");
      }
    } catch (error) {
      // Network error or other exception
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Network error or connection failed";
      console.error("Failed to home Z axis:", error);
      showSnackbar(`Failed to home Z axis: ${errorMessage}`, "error");
    } finally {
      setIsHoming((prev) => ({ ...prev, z: false }));
    }
  };

  const homeAll = async () => {
    setIsHoming((prev) => ({ ...prev, all: true }));
    try {
      // Home XY first, then Z (common homing sequence)
      const xyResponse = await printerApi.homeXYAxes();
      if (!xyResponse.success) {
        const errorMessage =
          xyResponse.message || "Unknown error occurred while homing XY axes";
        console.error("XY homing failed during Home All:", errorMessage);
        showSnackbar(`XY homing failed: ${errorMessage}`, "error");
        return; // Stop execution if XY homing fails
      }

      const zResponse = await printerApi.homeZAxis();
      if (!zResponse.success) {
        const errorMessage =
          zResponse.message || "Unknown error occurred while homing Z axis";
        console.error("Z homing failed during Home All:", errorMessage);
        showSnackbar(`Z homing failed: ${errorMessage}`, "error");
        return; // Stop execution if Z homing fails
      }

      // Both XY and Z homing succeeded
      setPositions({
        x: 0,
        y: 0,
        z: 0,
        extruder: 0,
        syringe: 0,
      });

      showSnackbar("All axes homed successfully", "success");
    } catch (error) {
      // Network error or other exception
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Network error or connection failed";
      console.error("Failed to home all axes:", error);
      showSnackbar(`Failed to home all axes: ${errorMessage}`, "error");
    } finally {
      setIsHoming((prev) => ({ ...prev, all: false }));
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Motor Control
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Homing Section */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-gray-700">
              Homing Controls
            </h4>
            <div className="flex justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={homeXY}
                disabled={isHoming.xy || isHoming.all}
              >
                {isHoming.xy ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Home className="w-4 h-4 mr-1" />
                )}
                Home XY
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={homeZ}
                disabled={isHoming.z || isHoming.all}
              >
                {isHoming.z ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Home className="w-4 h-4 mr-1" />
                )}
                Home Z
              </Button>
              <Button onClick={homeAll} disabled={isHoming.all} size="sm">
                {isHoming.all ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Home className="w-4 h-4 mr-1" />
                )}
                Home All
              </Button>
            </div>
          </div>

          {/* Current Positions */}
          <div className="flex justify-between items-center space-x-4">
            <div className="text-center">
              <Badge variant="outline" className="w-full">
                X: {positions.x.toFixed(2)} mm
              </Badge>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="w-full">
                Y: {positions.y.toFixed(2)} mm
              </Badge>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="w-full">
                Z: {positions.z.toFixed(2)} mm
              </Badge>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="w-full">
                E: {positions.extruder.toFixed(2)} mm
              </Badge>
            </div>
          </div>

          {/* Step Size Controls */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-gray-700">
              Movement Step Sizes
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label htmlFor="xy-step" className="text-xs">
                  XY Step (mm)
                </Label>
                <Input
                  id="xy-step"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={stepSizes.xy}
                  onChange={(e) =>
                    setStepSizes((prev) => ({
                      ...prev,
                      xy: parseFloat(e.target.value) || 0.1,
                    }))
                  }
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="z-step" className="text-xs">
                  Z Step (mm)
                </Label>
                <Input
                  id="z-step"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={stepSizes.z}
                  onChange={(e) =>
                    setStepSizes((prev) => ({
                      ...prev,
                      z: parseFloat(e.target.value) || 0.01,
                    }))
                  }
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="e-step" className="text-xs">
                  Extruder Step
                </Label>
                <Input
                  id="e-step"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={stepSizes.extruder}
                  onChange={(e) =>
                    setStepSizes((prev) => ({
                      ...prev,
                      extruder: parseFloat(e.target.value) || 0.1,
                    }))
                  }
                  className="h-8"
                />
              </div>
            </div>
          </div>
          {/* Extruder */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">Extruder</h4>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent w-1/2"
                onClick={() => moveMotor("extruder", 1)}
              >
                Extrude
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent w-1/2"
                onClick={() => moveMotor("extruder", -1)}
              >
                Retract
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* XY Control */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700">XY Movement</h4>
              <div className="grid grid-cols-3 gap-2 w-32 mx-auto">
                <div></div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => moveMotor("y", 1)}
                  disabled={isHoming.xy || isHoming.all}
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <div></div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => moveMotor("x", -1)}
                  disabled={isHoming.xy || isHoming.all}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div></div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => moveMotor("x", 1)}
                  disabled={isHoming.xy || isHoming.all}
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <div></div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => moveMotor("y", -1)}
                  disabled={isHoming.xy || isHoming.all}
                >
                  <ArrowDown className="w-4 h-4" />
                </Button>
                <div></div>
              </div>
            </div>

            {/* Z Control */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700">Z Movement</h4>
              <div className="flex flex-col justify-center space-y-2 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => moveMotor("z", 1)}
                  disabled={isHoming.z || isHoming.all}
                >
                  <ArrowUp className="w-4 h-4 mr-1" />
                  Z+
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => moveMotor("z", -1)}
                  disabled={isHoming.z || isHoming.all}
                >
                  <ArrowDown className="w-4 h-4 mr-1" />
                  Z-
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Snackbar */}
      {snackbar.show && (
        <div className="fixed bottom-4 right-4 z-50 max-w-md">
          <Alert
            variant={snackbar.type === "error" ? "destructive" : "default"}
            className="shadow-lg border"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{snackbar.message}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={hideSnackbar}
                className="h-auto p-0 ml-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
}
