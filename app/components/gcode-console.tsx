"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, Send } from "lucide-react";

interface ConsoleEntry {
  id: string;
  type: "command" | "response" | "error";
  content: string;
  timestamp: string;
}

export function GCodeConsole() {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<ConsoleEntry[]>([
    {
      id: "1",
      type: "response",
      content: "Printer initialized successfully",
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      id: "2",
      type: "command",
      content: "G28",
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      id: "3",
      type: "response",
      content: "Homing completed",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new entries are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [history]);

  const sendCommand = () => {
    if (!command.trim()) return;

    const newCommand: ConsoleEntry = {
      id: Date.now().toString(),
      type: "command",
      content: command,
      timestamp: new Date().toLocaleTimeString(),
    };

    setHistory((prev) => [...prev, newCommand]);

    // Simulate response
    setTimeout(() => {
      const response: ConsoleEntry = {
        id: (Date.now() + 1).toString(),
        type: "response",
        content: `OK - Command "${command}" executed`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setHistory((prev) => [...prev, response]);
    }, 500);

    setCommand("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendCommand();
    }
  };

  const getEntryStyle = (type: string) => {
    switch (type) {
      case "command":
        return "text-blue-600 font-medium";
      case "response":
        return "text-green-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getEntryPrefix = (type: string) => {
    switch (type) {
      case "command":
        return "> ";
      case "response":
        return "< ";
      case "error":
        return "! ";
      default:
        return "  ";
    }
  };

  return (
    <Card className="h-96">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal className="w-5 h-5" />
          G-code Console
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 h-full flex flex-col">
        {/* Console Output */}
        <ScrollArea className="flex-1 border rounded-md p-3 bg-gray-900 text-gray-100 font-mono text-sm">
          <div ref={scrollAreaRef} className="space-y-1">
            {history.map((entry) => (
              <div key={entry.id} className="flex">
                <span className="text-gray-500 text-xs w-20 flex-shrink-0">
                  entry.timestamp
                </span>
                <span className={getEntryStyle(entry.type)}>
                  {getEntryPrefix(entry.type)}
                  {entry.content}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Command Input */}
        <div className="flex gap-2">
          <Input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter G-code command (e.g., G28, M104 S200)"
            className="font-mono"
          />
          <Button onClick={sendCommand} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Commands */}
        <div className="flex gap-2 flex-wrap">
          {["G28", "M104 S200", "M140 S60", "G1 Z10"].map((cmd) => (
            <Button
              key={cmd}
              variant="outline"
              size="sm"
              onClick={() => setCommand(cmd)}
              className="font-mono text-xs"
            >
              {cmd}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
