"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, RotateCcw, FileText, Clock, CheckCircle, XCircle } from "lucide-react"

interface PrintJob {
  id: string
  filename: string
  duration: string
  status: "Success" | "Failed" | "Cancelled"
  startTime: string
  fileSize: string
}

export function PrintHistory() {
  const [printJobs] = useState<PrintJob[]>([
    {
      id: "1",
      filename: "miniature_dragon.gcode",
      duration: "3h 24m",
      status: "Success",
      startTime: "2024-01-15 14:30",
      fileSize: "2.4 MB",
    },
    {
      id: "2",
      filename: "phone_case.gcode",
      duration: "1h 45m",
      status: "Success",
      startTime: "2024-01-15 10:15",
      fileSize: "1.8 MB",
    },
    {
      id: "3",
      filename: "complex_gear.gcode",
      duration: "2h 12m",
      status: "Failed",
      startTime: "2024-01-14 16:20",
      fileSize: "3.1 MB",
    },
    {
      id: "4",
      filename: "keychain.gcode",
      duration: "45m",
      status: "Success",
      startTime: "2024-01-14 09:30",
      fileSize: "0.9 MB",
    },
    {
      id: "5",
      filename: "vase_spiral.gcode",
      duration: "4h 15m",
      status: "Cancelled",
      startTime: "2024-01-13 13:45",
      fileSize: "4.2 MB",
    },
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Success":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "Failed":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "Cancelled":
        return <XCircle className="w-4 h-4 text-yellow-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Success":
        return "bg-green-100 text-green-800"
      case "Failed":
        return "bg-red-100 text-red-800"
      case "Cancelled":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleDownload = (job: PrintJob) => {
    console.log(`Downloading ${job.filename}`)
  }

  const handleReprint = (job: PrintJob) => {
    console.log(`Reprinting ${job.filename}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Print History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Filename</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {printJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      {job.filename}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      {job.duration}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(job.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(job.status)}
                        {job.status}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">{job.startTime}</TableCell>
                  <TableCell className="text-gray-600">{job.fileSize}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleDownload(job)}>
                        <Download className="w-4 h-4" />
                      </Button>
                      {job.status === "Success" && (
                        <Button variant="outline" size="sm" onClick={() => handleReprint(job)}>
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
