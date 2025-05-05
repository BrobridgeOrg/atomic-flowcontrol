# Atomic Flow Control

[![Node.js](https://img.shields.io/badge/Node.js->=18-brightgreen.svg)](https://nodejs.org/)
[![Node-RED](https://img.shields.io/badge/Node--RED->=2.0.0-red.svg)](https://nodered.org/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

A powerful Node-RED module for managing data flows in Brobridge Atomic applications. This module allows you to pause and resume the processing of large datasets in a controlled manner, optimizing performance and reducing memory consumption. Compatible with any node that supports the flow control interface.

## Features

- **Stream Control**: Pause and resume data streams from flow controllable nodes
- **Multiple Sessions**: Handle multiple processing sessions independently
- **Performance Optimization**: Reduce memory usage when working with large datasets
- **Flexible Targeting**: Target nodes automatically or specify exact nodes to control

## Installation

```bash
npm install @brobridge/atomic-flowcontrol
```

Or install directly from the Node-RED interface:

1. Open your Node-RED instance
2. Navigate to the menu → Manage palette
3. Select the "Install" tab
4. Search for "@brobridge/atomic-flowcontrol"
5. Click install

## Usage

The Flow Control node is designed to work with any node that has the `flowControllable` property set to true. Typically, these are nodes that handle streaming data or long-running operations. The module provides two main actions:

### Continue Action

Resumes processing of paused data streams.

1. Drag the "Flow Control" node from the function category to your flow
2. Set the Action to "Continue"
3. Configure target node selection (Auto or Specific)
4. Connect to your flow at the point where you want to resume processing

### Break Action

Stops processing a stream and releases associated resources.

1. Drag the "Flow Control" node from the function category to your flow
2. Set the Action to "Break"
3. Configure target node selection (Auto or Specific)
4. Connect to your flow at the point where you want to stop processing

## Configuration

### Target Node Selection

You can configure how the Flow Control node selects its target:

- **Auto Select**: Automatically identifies target nodes based on session ID
- **Specific Nodes**: Manually select which nodes to control

### Message Format

The input message to the Flow Control node should contain a sessions array:

```javascript
{
  sessions: ["nodeId-sessionId", "nodeId-sessionId", ...],
  // Optional
  selectMode: "auto" // Override the node's configured selection mode
}
```

## Example Flow

```json
[
  {
    "id": "source-node",
    "type": "Stream Source",
    "name": "Generate Large Dataset",
    "flowControllable": true,
    "wires": [
      ["process-node"]
    ]
  },
  {
    "id": "process-node",
    "type": "function",
    "name": "Process Batch",
    "func": "// Processing logic\nreturn msg;",
    "wires": [
      ["flow-control"]
    ]
  },
  {
    "id": "flow-control",
    "type": "Flow Control",
    "name": "Continue Processing",
    "action": "continue",
    "selectMode": "auto",
    "wires": []
  }
]
```

## Compatibility

- Requires Node.js 18 or later
- Requires Node-RED 2.0.0 or later
- Compatible with any node that implements the flow control interface (has the `flowControllable` property)
- Designed for use with Brobridge Atomic platform

## Development

```bash
# Clone the repository
git clone https://github.com/BrobridgeOrg/atomic-flowcontrol.git

# Install dependencies
cd atomic-flowcontrol
npm install

# Test (when tests are available)
npm test
```

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Author

Fred Chien <fred@brobridge.com>

## Support

For issues and feature requests, please [file an issue](https://github.com/BrobridgeOrg/atomic-flowcontrol/issues) on GitHub.
