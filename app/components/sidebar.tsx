"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  Upload,
  Settings,
  Activity,
  FileText,
  Gauge,
  AlertTriangle,
  Terminal,
} from "lucide-react";
import { Logo } from "../assets";

const navigation = [
  { name: "Dashboard", icon: Home, current: true },
  { name: "Upload", icon: Upload, current: false },
  { name: "Monitor", icon: Activity, current: false },
  { name: "Controls", icon: Settings, current: false },
  { name: "Sensors", icon: Gauge, current: false },
  { name: "Console", icon: Terminal, current: false },
  { name: "History", icon: FileText, current: false },
  { name: "Alerts", icon: AlertTriangle, current: false },
];

export function Sidebar() {
  return (
    <div className="fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {/* <div className="w-8 h-8 rounded-lg flex items-center justify-center"> */}
            {/* <Settings className="w-5 h-5 text-white" /> */}
            <img src={Logo} alt="logo" />
            {/* </div> */}
            <span className="text-xl font-semibold text-gray-900">
              SmartPrint
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <Button
              key={item.name}
              variant={item.current ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-11",
                item.current
                  ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Button>
          ))}
        </nav>

        {/* Status */}
        <div className="px-4 py-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-sm text-gray-600">System Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}
