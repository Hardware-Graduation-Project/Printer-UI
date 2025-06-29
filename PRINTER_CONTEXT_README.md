# Printer Status Context

This document explains how to use the Printer Status Context system for managing printer state throughout the application.

## Overview

The Printer Status Context provides a centralized way to manage and share printer status information across all components in the application. It uses React Context and useReducer for state management.

## Files Structure

```
app/
├── contexts/
│   └── PrinterStatusContext.tsx    # Main context implementation
├── hooks/
│   └── usePrinterAPI.ts           # API integration hook
└── components/
    ├── printer-control-demo.tsx    # Demo component for testing
    └── printer-status-card.tsx     # Status display component
```

## Usage

### 1. Basic Usage

```tsx
import { usePrinterStatus } from '../contexts/PrinterStatusContext';

function MyComponent() {
  const { state, updateStatus } = usePrinterStatus();
  
  return (
    <div>
      <p>Current Status: {state.status}</p>
      <p>Progress: {state.progress}%</p>
      <button onClick={() => updateStatus('printing')}>
        Start Printing
      </button>
    </div>
  );
}
```

### 2. API Integration

```tsx
import { usePrinterAPI } from '../hooks/usePrinterAPI';
import { usePrinterStatus } from '../contexts/PrinterStatusContext';

function MyComponent() {
  const { refreshStatus, isConnected } = usePrinterAPI();
  const { state } = usePrinterStatus();
  
  // The hook automatically polls for updates
  // You can also manually refresh
  
  return (
    <div>
      <p>Connection: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <p>Status: {state.status}</p>
      <button onClick={refreshStatus}>Refresh</button>
    </div>
  );
}
```

## Available State

The context provides the following state:

```typescript
interface PrinterState {
  status: PrintStatus;                    // Current printer status
  progress: number;                       // Print progress (0-100)
  elapsedTime: string;                   // Time elapsed (HH:MM:SS)
  estimatedTime: string;                 // Estimated total time (HH:MM:SS)
  filename: string;                      // Current file being printed
  temperatures: {
    extruder: {
      current: number;                   // Current temperature
      target: number;                    // Target temperature
    };
  };
  position: {                           // Current printer head position
    x: number;
    y: number;
    z: number;
    e: number;
  };
  isConnected: boolean;                 // Connection status
  lastUpdated: Date | null;             // Last update timestamp
}
```

## Available Actions

```typescript
// Update individual properties
updateStatus(status: PrintStatus)
updateProgress(progress: number)
updateTime(elapsed: string, estimated: string)
updateFilename(filename: string)
updateTemperatures(current: number, target: number)
updatePosition(x: number, y: number, z: number, e: number)
setConnectionStatus(connected: boolean)

// Update from API response
updateFullStatus(status: PrinterStatus)

// Reset to initial state
resetState()
```

## Status Values

Valid status values include:
- `"ready"` - Printer is ready
- `"printing"` - Currently printing
- `"paused"` - Print is paused
- `"complete"` - Print completed successfully
- `"cancelled"` - Print was cancelled
- `"error"` - Error occurred
- `"standby"` - Printer in standby mode

## API Integration

The `usePrinterAPI` hook provides automatic polling and manual refresh capabilities:

```typescript
const { refreshStatus, isConnected, lastUpdated } = usePrinterAPI();
```

### Customizing API Calls

To integrate with your actual printer API, modify the `fetchPrinterStatus` function in `hooks/usePrinterAPI.ts`:

```typescript
const fetchPrinterStatus = async (): Promise<PrinterStatus> => {
  const response = await fetch('/api/printer/status');
  if (!response.ok) {
    throw new Error('Failed to fetch printer status');
  }
  return response.json();
};
```

## Demo Components

### PrinterControlDemo
Located at `components/printer-control-demo.tsx`, this component demonstrates:
- Manual status changes
- State updates
- Connection simulation
- Reset functionality

### PrinterStatusCard
Located at `components/printer-status-card.tsx`, this component shows:
- Real-time status display
- Connection status
- Temperature readings
- Position information
- Manual refresh button

## Best Practices

1. **Use the context for shared state only** - Don't put component-specific state in the global context
2. **Batch updates** - When updating multiple properties, consider using `updateFullStatus`
3. **Handle errors gracefully** - Always handle API errors and update connection status
4. **Optimize polling frequency** - Adjust the polling interval based on your needs (currently 2 seconds)
5. **Use TypeScript** - The context is fully typed for better development experience

## Example: Creating a New Component

```tsx
"use client";

import { usePrinterStatus } from '../contexts/PrinterStatusContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function MyPrinterComponent() {
  const { state, updateStatus } = usePrinterStatus();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Printer Component</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Status: {state.status}</p>
        <p>Connected: {state.isConnected ? 'Yes' : 'No'}</p>
        {state.status === 'printing' && (
          <p>Progress: {state.progress.toFixed(1)}%</p>
        )}
      </CardContent>
    </Card>
  );
}
```

## Troubleshooting

1. **Context not available error**: Make sure your component is wrapped with `PrinterProvider`
2. **API not updating**: Check network requests and error handling in the browser console
3. **Type errors**: Ensure you're using the correct status values as defined in the types
4. **Performance issues**: Consider reducing polling frequency or using WebSocket connections for real-time updates
