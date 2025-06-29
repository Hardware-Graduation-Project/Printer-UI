"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  FileText,
  Edit,
  Save,
  Plus,
  Download,
  RefreshCw,
  Power,
  Trash2,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { controllerService } from "@/app/APIs/ControllersApi";

interface Controller {
  id: string;
  name: string;
  type: string;
  status: "online" | "offline" | "error";
  active: boolean;
  configFile: string;
  lastModified: string;
}

export function ControllersPanel() {
  const [controllers, setControllers] = useState<Controller[]>([]);
  const [selectedController, setSelectedController] =
    useState<Controller | null>(null);
  const [editedConfig, setEditedConfig] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newController, setNewController] = useState({
    name: "",
    type: "Klipper",
    configFile: "",
  });
  const { toast } = useToast();

  // Load controllers on component mount
  useEffect(() => {
    loadControllers();
  }, []);

  const loadControllers = async () => {
    setIsLoading(true);
    try {
      const controllersData = await controllerService.getAllControllers();

      // Load full controller data including config text
      const formattedControllers: Controller[] = await Promise.all(
        controllersData.map(async (ctrl, index) => {
          try {
            // Load the full controller config
            const fullController = await controllerService.getController(
              ctrl.controller_id
            );
            console.log(`Loaded config for ${ctrl.controller_name}:`, {
              textLength: fullController.text?.length || 0,
              lineCount: fullController.text?.split("\n").length || 0,
            });

            return {
              id: ctrl.controller_id,
              name: ctrl.controller_name,
              type: "Klipper",
              status: "offline" as const,
              active: index === 0,
              configFile: fullController.text || "",
              lastModified: new Date(ctrl.updated_at).toLocaleString(),
            };
          } catch (error) {
            console.error(
              `Failed to load config for ${ctrl.controller_name}:`,
              error
            );
            return {
              id: ctrl.controller_id,
              name: ctrl.controller_name,
              type: "Klipper",
              status: "offline" as const,
              active: index === 0,
              configFile: "", // Empty if failed to load
              lastModified: new Date(ctrl.updated_at).toLocaleString(),
            };
          }
        })
      );

      setControllers(formattedControllers);
    } catch (error) {
      console.error("Failed to load controllers:", error);
      toast({
        title: "Error",
        description: "Failed to load controllers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditController = async (controller: Controller) => {
    setSelectedController(controller);
    setIsDialogOpen(true);

    // First, set the existing config if available
    if (controller.configFile) {
      console.log("Setting existing config from controller:", {
        textLength: controller.configFile.length,
        lineCount: controller.configFile.split("\n").length,
      });
      setEditedConfig(controller.configFile);
    }

    try {
      // Try to load the latest config from API
      const fullController = await controllerService.getController(
        controller.id
      );

      // Debug: Log the loaded config
      console.log("Loaded fresh controller config:", {
        controllerId: controller.id,
        textLength: fullController.text?.length || 0,
        lineCount: fullController.text?.split("\n").length || 0,
        firstLine: fullController.text?.split("\n")[0] || "",
        lastLine: fullController.text?.split("\n").slice(-1)[0] || "",
        fullText: fullController.text,
      });

      // Update with fresh config
      setEditedConfig(fullController.text || controller.configFile || "");
    } catch (error) {
      console.error("Failed to load controller config:", error);
      toast({
        title: "Warning",
        description:
          "Using cached configuration. Failed to load latest version.",
        variant: "default",
      });
      // Keep the existing config that was already set
      if (!controller.configFile) {
        setEditedConfig("");
      }
    }
  };

  const handleAddController = () => {
    const defaultConfig = [
      "# Klipper Configuration",
      "# New Controller",
      "",
      "[mcu]",
      "serial: /dev/serial/by-id/usb-XXXXXXXX",
      "",
      "[printer]",
      "kinematics: cartesian",
      "max_velocity: 300",
      "max_accel: 3000",
      "max_z_velocity: 5",
      "max_z_accel: 100",
      "",
      "# Add your configuration sections here",
    ].join("\n");

    setNewController({
      name: "",
      type: "Klipper",
      configFile: defaultConfig,
    });
    setIsAddDialogOpen(true);
  };

  const handleSaveNewController = async () => {
    if (!newController.name.trim()) {
      toast({
        title: "Error",
        description: "Controller name is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Debug: Log the config before sending
      console.log("Config being sent:", {
        controller_name: newController.name,
        text: newController.configFile,
        textLength: newController.configFile.length,
        lineCount: newController.configFile.split("\n").length,
      });

      const createdController = await controllerService.createController({
        controller_name: newController.name,
        text: newController.configFile,
      });

      // Debug: Log the response
      console.log("Controller created:", createdController);

      const controller: Controller = {
        id: createdController.controller_id,
        name: createdController.controller_name,
        type: newController.type,
        status: "offline",
        active: false,
        configFile: createdController.text,
        lastModified: new Date(createdController.updated_at).toLocaleString(),
      };

      setControllers([...controllers, controller]);
      setIsAddDialogOpen(false);
      setNewController({
        name: "",
        type: "Klipper",
        configFile: [
          "# Klipper Configuration",
          "# New Controller",
          "",
          "[mcu]",
          "serial: /dev/serial/by-id/usb-XXXXXXXX",
          "",
          "[printer]",
          "kinematics: cartesian",
          "max_velocity: 300",
          "max_accel: 3000",
          "max_z_velocity: 5",
          "max_z_accel: 100",
          "",
          "# Add your configuration sections here",
        ].join("\n"),
      });

      toast({
        title: "Controller Added",
        description: `${controller.name} has been added successfully.`,
      });
    } catch (error) {
      console.error("Failed to create controller:", error);
      toast({
        title: "Error",
        description: "Failed to create controller. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivateController = async (controllerId: string) => {
    const activatedController = controllers.find(
      (ctrl) => ctrl.id === controllerId
    );
    if (!activatedController) return;

    try {
      setIsLoading(true);

      // Call the API to set the printer config with the controller ID
      await controllerService.setPrinterConfig(controllerId);

      // Update the local state to reflect the activation
      setControllers(
        controllers.map((ctrl) => ({
          ...ctrl,
          active: ctrl.id === controllerId,
        }))
      );

      toast({
        title: "Controller Activated",
        description: `${activatedController.name} is now the active controller and printer config has been set.`,
      });
    } catch (error) {
      console.error("Failed to activate controller:", error);
      toast({
        title: "Error",
        description: "Failed to activate controller. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteController = async (controllerId: string) => {
    const controllerToDelete = controllers.find(
      (ctrl) => ctrl.id === controllerId
    );
    if (!controllerToDelete) return;

    // Prevent deletion if it's the only controller
    if (controllers.length === 1) {
      toast({
        title: "Cannot Delete",
        description: "You must have at least one controller.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await controllerService.deleteController(controllerId);

      // If deleting the active controller, activate the first remaining controller
      const remainingControllers = controllers.filter(
        (ctrl) => ctrl.id !== controllerId
      );
      const updatedControllers =
        controllerToDelete.active && remainingControllers.length > 0
          ? remainingControllers.map((ctrl, index) => ({
              ...ctrl,
              active: index === 0,
            }))
          : remainingControllers;

      setControllers(updatedControllers);

      toast({
        title: "Controller Deleted",
        description: `${controllerToDelete.name} has been removed successfully.`,
      });
    } catch (error) {
      console.error("Failed to delete controller:", error);
      toast({
        title: "Error",
        description: "Failed to delete controller. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    if (!selectedController) return;

    try {
      setIsLoading(true);

      // Debug: Log what's being saved
      console.log("Saving controller config:", {
        controllerId: selectedController.id,
        textLength: editedConfig.length,
        lineCount: editedConfig.split("\n").length,
        firstLine: editedConfig.split("\n")[0],
        lastLine: editedConfig.split("\n").slice(-1)[0],
        fullText: editedConfig,
      });

      const updatedController = await controllerService.updateController(
        selectedController.id,
        { text: editedConfig }
      );

      // Debug: Log what was returned
      console.log("Updated controller response:", updatedController);

      setControllers(
        controllers.map((ctrl) =>
          ctrl.id === selectedController.id
            ? {
                ...ctrl,
                configFile: updatedController.text,
                lastModified: new Date(
                  updatedController.updated_at
                ).toLocaleString(),
              }
            : ctrl
        )
      );

      setIsDialogOpen(false);
      toast({
        title: "Configuration Saved",
        description: `Configuration for ${selectedController.name} has been updated successfully.`,
      });
    } catch (error) {
      console.error("Failed to save controller config:", error);
      toast({
        title: "Error",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadConfig = async (controller: Controller) => {
    let configContent = controller.configFile;

    // If no config in memory, try to fetch it
    if (!configContent) {
      try {
        const fullController = await controllerService.getController(
          controller.id
        );
        configContent = fullController.text || "";
      } catch (error) {
        console.error("Failed to load config for download:", error);
        toast({
          title: "Error",
          description: "Failed to load configuration for download.",
          variant: "destructive",
        });
        return;
      }
    }

    const blob = new Blob([configContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${controller.name
      .toLowerCase()
      .replace(/\s+/g, "-")}-config.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Configuration Downloaded",
      description: `Configuration file for ${controller.name} has been downloaded.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800";
      case "offline":
        return "bg-gray-100 text-gray-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-400";
      case "offline":
        return "bg-gray-400";
      case "error":
        return "bg-red-400";
      default:
        return "bg-gray-400";
    }
  };

  const handleCreateDefaultController = async () => {
    try {
      setIsLoading(true);
      const defaultController =
        await controllerService.createDefaultController();

      const controller: Controller = {
        id: defaultController.controller_id,
        name: defaultController.controller_name,
        type: "Klipper",
        status: "offline",
        active: controllers.length === 0, // Make it active if no other controllers exist
        configFile: defaultController.text,
        lastModified: new Date(defaultController.updated_at).toLocaleString(),
      };

      setControllers([...controllers, controller]);

      toast({
        title: "Default Controller Created",
        description: `${controller.name} has been created successfully.`,
      });
    } catch (error) {
      console.error("Failed to create default controller:", error);
      toast({
        title: "Error",
        description: "Failed to create default controller. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Controllers Configuration
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleAddController}>
              <Plus className="w-4 h-4 mr-2" />
              Add Controller
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateDefaultController}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Settings className="w-4 h-4 mr-2" />
              )}
              Default Controller
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={loadControllers}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {controllers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No Controllers Found</p>
              <p className="text-sm mb-4">
                Get started by adding a new controller or creating a default
                one.
              </p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={handleAddController}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Controller
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCreateDefaultController}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Settings className="w-4 h-4 mr-2" />
                  )}
                  Create Default
                </Button>
              </div>
            </div>
          ) : (
            controllers.map((controller) => (
              <div
                key={controller.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${getStatusDot(
                        controller.status
                      )}`}
                    ></div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {controller.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {controller.type}
                        </Badge>
                        <Badge
                          className={`text-xs ${getStatusColor(
                            controller.status
                          )}`}
                        >
                          {controller.status}
                        </Badge>
                        {controller.active && (
                          <Badge className="text-xs bg-blue-100 text-blue-800">
                            Active
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      Modified: {controller.lastModified}
                    </span>
                    <Button
                      variant={controller.active ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleActivateController(controller.id)}
                      disabled={controller.active || isLoading}
                      className={
                        controller.active
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : ""
                      }
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Power className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadConfig(controller)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteController(controller.id)}
                      disabled={isLoading}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                    <Dialog
                      open={
                        isDialogOpen && selectedController?.id === controller.id
                      }
                      onOpenChange={setIsDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditController(controller)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Edit Configuration - {selectedController?.name}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col gap-4 overflow-hidden">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="controller-name">
                                Controller Name
                              </Label>
                              <Input
                                id="controller-name"
                                value={selectedController?.name || ""}
                                readOnly
                              />
                            </div>
                            <div>
                              <Label htmlFor="controller-type">Type</Label>
                              <Input
                                id="controller-type"
                                value={selectedController?.type || ""}
                                readOnly
                              />
                            </div>
                          </div>

                          <div className="flex-1 overflow-hidden">
                            <Label htmlFor="config-content">
                              Configuration File (print.cnfg)
                            </Label>
                            <Textarea
                              id="config-content"
                              value={editedConfig}
                              onChange={(e) => {
                                console.log("Edit textarea value changed:", {
                                  length: e.target.value.length,
                                  lineCount: e.target.value.split("\n").length,
                                  firstLine: e.target.value.split("\n")[0],
                                  lastLine: e.target.value
                                    .split("\n")
                                    .slice(-1)[0],
                                });
                                setEditedConfig(e.target.value);
                              }}
                              className="min-h-[400px] font-mono text-sm resize-none"
                              placeholder="Enter configuration content..."
                              spellCheck={false}
                              wrap="off"
                            />
                          </div>

                          <div className="flex justify-end gap-2 pt-4 border-t">
                            <Button
                              variant="outline"
                              onClick={() => setIsDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleSaveConfig}
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Save className="w-4 h-4 mr-2" />
                              )}
                              Save Configuration
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>

      {/* Add Controller Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Controller
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 flex-1 overflow-hidden">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-controller-name">Controller Name</Label>
                <Input
                  id="new-controller-name"
                  value={newController.name}
                  onChange={(e) =>
                    setNewController({ ...newController, name: e.target.value })
                  }
                  placeholder="Enter controller name"
                />
              </div>
              <div>
                <Label htmlFor="new-controller-type">Type</Label>
                <Input
                  id="new-controller-type"
                  value={newController.type}
                  readOnly
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
              <Label htmlFor="new-config-content" className="mb-2">
                Configuration File (printer.cfg)
              </Label>
              <Textarea
                id="new-config-content"
                value={newController.configFile}
                onChange={(e) => {
                  console.log("Textarea value changed:", {
                    length: e.target.value.length,
                    lineCount: e.target.value.split("\n").length,
                    firstLine: e.target.value.split("\n")[0],
                    lastLine: e.target.value.split("\n").slice(-1)[0],
                  });
                  setNewController({
                    ...newController,
                    configFile: e.target.value,
                  });
                }}
                className="flex-1 font-mono text-sm resize-none border rounded-md p-3"
                placeholder="Enter Klipper configuration content..."
                spellCheck={false}
                wrap="off"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t bg-white sticky bottom-0">
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="min-w-20"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveNewController}
                disabled={isLoading}
                className="min-w-20 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
