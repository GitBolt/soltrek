<p align="center">
  <a href="https://twitter.com/soltrek_io">
    <img
      alt="SOL Trek"
      src="https://media.discordapp.net/attachments/865444983762452520/1075913428545327166/Group_72.png"
      width="150"
    />
  </a>
</p>

> **This project is being developed for the [Solana Grizzlython Hackathon](https://solana.com/grizzlython) under the Tools and Infra category.**

# SOL Trek

SOL Trek is a Solana learning playground that allows new developers to learn, develop and play with Solana without needing to write code. 

<br />
It provides a user-friendly, no-code environment where users can create nodes for various actions, such as string input, token transfers, fetching token details, generating keypairs, and more.

## Roadmap
- Integration with Seahorse Lang to enable basic Python code execution.
- Integration with more Solana programs such as Solend, Metaplex, and more.
- Adding tutorials and built-in modules for different concepts such as transactions, PDAs, accounts, and more.
- Adding a multiplayer option for real-time collaboration between developers.

## Code overview

This project is built with Next.js and Chakra UI for the frontend, while the node-based environment utilizes the React Flow library (https://reactflow.dev). 

The `src` folder is the entry point for the main website source code. The `node` folder contains all the nodes that the user can create. Each node is organized into its own file within a subfolder based on the category of actions it performs.

## Getting Started

To get started with SOL Trek, clone this repository and run the following commands:

```sh
yarn install
yarn dev
```

