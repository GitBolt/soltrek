<p align="center">
  <a href="https://twitter.com/soltrek_io">
    <img
      alt="SOL Trek"
      src="https://media.discordapp.net/attachments/865444983762452520/1075913428545327166/Group_72.png"
      width="150"
    />
  </a>
</p>

> *This project is being developed for the [Solana Grizzlython Hackathon](https://solana.com/grizzlython).

# SOL Trek

SOL Trek is a Solana learning playground that allows new developers to learn, develop and play with Solana without needing to write code. 

## How does it work?
It provides a user-friendly, no-code environment where users can create nodes for various actions, such as string input, token transfers, fetching token details, generating keypairs, and more. The nodes can be connected to each other to combine and perform various different actions.

## Feature lineup
- Accounts & PDAs
- Adding nodes for certain program interactions (Candymachine for example)
- Adding tutorials and built-in modules for different concepts that can be loaded.
- Integration with Seahorse Lang to enable basic Python code execution.
- Adding a multiplayer option for real-time collaboration between developers.

## Terminology
**Node**: Individual blocks a user can add to the playground from the sidebar or through Command + K.
**Edge**: The curvy magenta line which connects nodes.
**Handle**: The points through which an edge emerges or leads to. It can be either of type source (input) or target (output).

## Code overview
This project is built with Next.js and Chakra UI, while the node-based environment utilizes the [React Flow](https://reactflow.dev) library.
The [node](https://github.com/GitBolt/soltrek/tree/main/src/nodes) folder contains all the nodes that the user can create. Each node is organized into its own file within a subfolder based on the category of actions it performs.

## Getting Started
To get started with contributing to SOL Trek, clone this repository and run the following commands:

```sh
yarn install
yarn dev
```

