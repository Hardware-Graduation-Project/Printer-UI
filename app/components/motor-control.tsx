"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Home,
  Settings,
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

  const moveMotor = (
    axis: keyof MotorPositions,
    direction: number,
    distance = 1
  ) => {
    setPositions((prev) => ({
      ...prev,
      [axis]: prev[axis] + direction * distance,
    }));
  };

  const homeAxis = (axis: keyof MotorPositions) => {
    setPositions((prev) => ({
      ...prev,
      [axis]: 0,
    }));
  };

  const homeAll = () => {
    setPositions({
      x: 0,
      y: 0,
      z: 0,
      extruder: 0,
      syringe: 0,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Motor Control
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Positions */}
        <div className="grid grid-cols-5 gap-2">
          <div className="text-center">
            <Badge variant="outline" className="w-full">
              X: {positions.x}mm
            </Badge>
          </div>
          <div className="text-center">
            <Badge variant="outline" className="w-full">
              Y: {positions.y}mm
            </Badge>
          </div>
          <div className="text-center">
            <Badge variant="outline" className="w-full">
              Z: {positions.z}mm
            </Badge>
          </div>
          <div className="text-center">
            <Badge variant="outline" className="w-full">
              E: {positions.extruder}mm
            </Badge>
          </div>
        </div>

        {/* XY Control */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-700">XY Movement</h4>
          <div className="grid grid-cols-3 gap-2 w-32 mx-auto">
            <div></div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => moveMotor("y", 1)}
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
            <div></div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => moveMotor("x", -1)}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={homeAll}>
              <Home className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => moveMotor("x", 1)}
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
            <div></div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => moveMotor("y", -1)}
            >
              <ArrowDown className="w-4 h-4" />
            </Button>
            <div></div>
          </div>
        </div>

        {/* Z Control */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-700">Z Movement</h4>
          <div className="flex justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => moveMotor("z", 1)}
            >
              <ArrowUp className="w-4 h-4 mr-1" />
              Z+
            </Button>
            <Button variant="outline" size="sm" onClick={() => homeAxis("z")}>
              <Home className="w-4 h-4 mr-1" />
              Home Z
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => moveMotor("z", -1)}
            >
              <ArrowDown className="w-4 h-4 mr-1" />
              Z-
            </Button>
          </div>
        </div>

        {/* Extruder & Syringe */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-700">Extruder</h4>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent w-1/2"
              onClick={() => moveMotor("extruder", 1, 5)}
            >
              Extrude
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent w-1/2"
              onClick={() => moveMotor("extruder", -1, 5)}
            >
              Retract
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
