<p align="center">
  <a href="https://twitter.com/soltrek_io">
    <img
      alt="SOL Trek"
      src="https://media.discordapp.net/attachments/865444983762452520/1075913428545327166/Group_72.png"
      width="160"
    />
  </a>
</p>

# SOL Trek

SOL Trek is a Solana learning playground that allows new developers to learn, develop and play with Solana without needing to write code.

## How does it work?
It provides a user-friendly, no-code environment where users can create nodes for various actions, such as string input, token transfers, fetching token details, generating keypairs, and more. The nodes can be connected to each other to combine and perform various different actions.

## Code overview
This project is built with Next.js and Chakra UI, while the node-based environment utilizes the [React Flow](https://reactflow.dev) library.
The [node](https://github.com/GitBolt/soltrek/tree/main/src/nodes) folder contains all the nodes that the user can create. Each node is organized into its own file within a subfolder based on the category of actions it performs.

## Getting Started
To get started with contributing to SOL Trek, clone this repository and run the following commands:

```sh
yarn install
yarn dev
```
Make sure to read [CONTRIBUTING.md](https://github.com/GitBolt/soltrek/blob/main/CONTRIBUTING.md) before getting started!
<br/>
All required nodes that need to be added are mentioned in the [Wiki](https://github.com/GitBolt/soltrek/wiki), have a look into it if you want to add anything new!

## Terminology
- **Node**: Individual blocks a user can add to the playground from the sidebar or through Command + K.
- **Edge**: The curvy magenta coloured line which connects nodes.
- **Handle**: The points through which an edge emerges or leads to. It can be either of type source (input) or target (output).

## Import Todo
In the current data sharing model, a node can output data through multiple "output handles". Each output handle is identified by a unique ID that is specific to the handle's node. When a target node wants to receive data from an output handle, it connects its "input handle" to the output handle of the source node. This connection creates an "edge" between the two nodes, which represents the flow of data from the source node to the target node.

When data is sent from the source node to the target node, it is stored in the data attribute of the target node. Specifically, the data is stored as an object with the source node's ID as the key and the output data as the value. For example, if the source node has an ID of "node-1" and it outputs data "1", the data object in the target node would look like this: { "node-1": "1" }.

The problem is when a single source node wants to output multiple values through different output handles, and these values need to be received by a single target node. Since the data object in the target node can only store one value per source node ID, it's not possible to receive multiple values from a single source node using this approach.