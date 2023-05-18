import { SidebarContentType } from '@/types/sidebar';

export const sidebarContent: SidebarContentType[] = [
  {
    title: "Input",
    icon: "/icons/Input.svg",
    items: [
      {
        title: "String Input",
        type: "stringInput",
      },
      {
        title: "Integer Input",
        type: "integerInput",
      },
      {
        title: "Button",
        type: "buttonInput",
      },
      {
        title: "File Input",
        type: "fileInput",
      },
    ],
  },
  {
    title: "Output",
    icon: "/icons/Output.svg",
    items: [
      {
        title: "Text Output",
        type: "textOutput",
      },
      {
        title: "Color Output",
        type: "colorOutput",
      },
    ],
  },
  {
    title: "Crypto",
    icon: "/icons/Crypto.svg",
    items: [
      {
        title: "Keypair",
        type: "keypair",
      },
      {
        title: "PDA",
        type: "PDA",
      },
      {
        title: "Mnemonic/Seed",
        type: "mnemonic",
      },
      {
        title: "Sign Message",
        type: "signMessage",
      },
      {
        title: "Verify Message",
        type: "verifyMessage",
      },
    ],
  },
  // {
  //   title: "Math",
  //   icon: "/icons/Math.svg",
  //   items: [
  //     {
  //       title: "Add",
  //       type: "add",
  //     },
  //   ],
  // },
  {
    title: "SDKs",
    icon: "/icons/SDK.svg",
    items: [
      {
        title: "HXRO - Parimutuel",
        type: "hxroNetwork",
        icon: "/logos/HXRO.svg",
        sub: [
          {
            title: "Get Contests",
            type: "hxroPariGet"
          },
          {
            title: "Place Position",
            type: "hxroPariPlace",
          },
          {
            title: "Destroy Position",
            type: "hxroPariDestroy",
          },
          {
            title: "Get Store",
            type: "hxroPariGetStore",
          },
          {
            title: "Get User Positions",
            type: "hxroPariGetUserPositions",
          },
        ]
      },
      {
        title: "HXRO - Dexterity",
        type: "hxroNetwork",
        icon: "/logos/HXRO.svg",
        sub: [
          {
            title: "Create TRG",
            type: "dexCreateTRG"
          },
          {
            title: "View TRG Account",
            type: "dexViewTRG"
          },
          {
            title: "Deposit Amount",
            type: "dexDepositAmount"
          },
          {
            title: "Withdraw Amount",
            type: "dexWithdrawAmount"
          },
          {
            title: "Place Limit Order",
            type: "dexPlaceLimitOrder"
          },
          {
            title: "Cancel All Limit Order",
            type: "dexCancelAllOrders"
          },
          {
            title: "Orderbook",
            type: "dexOrderbook"
          },
        ]
      },
      {
        title: "CandyMachine",
        type: "candyMachine",
        icon: "/logos/Metaplex.svg",
        sub: [
          {
            title: "Get Candy Machine",
            type: "candyMachineGet"
          },
          {
            title: "Create Candy Machine",
            type: "candyMachineCreate"
          },
          {
            title: "Delete Candy Machine",
            type: "deleteCandyMachine"
          },
          {
            title: "Candy Machine Config",
            type: "candyMachineInput",
          },
          {
            title: "Insert NFT",
            type: "insertNft",
          },
          {
            title: "Mint NFT",
            type: "mintNFT",
          },
          {
            title: "Fetch NFTs",
            type: "fetchNFTs",
          },
        ]
      },

    ],
  },
  {
    title: "Explorer",
    icon: "/icons/Explorer.svg",
    items: [
      {
        title: "Get Transaction",
        type: "getTransaction",
      },
      {
        title: "Get Token Details",
        type: "getTokenDetails",
      },
      {
        title: "Get SNS Domain",
        type: "getSns",
      },
      {
        title: "Get SOL Balance",
        type: "getSOLBalance",
      },
      {
        title: "Get User Tokens",
        type: "getUserTokens",
      },
    ],
  },
  {
    title: "Web3",
    icon: "/icons/Web3.svg",
    items: [
      {
        title: "Transaction",
        type: "transaction",
      },
      {
        title: "Airdrop",
        type: "requestAirdrop",
      },
      {
        title: "Send SOL",
        type: "sendSOL",
      },
      {
        title: "Send Token",
        type: "sendToken",
      },
      {
        title: "Create Token",
        type: "createToken",
      },
      {
        title: "Solana Pay",
        type: "solanaPay",
      },
    ],
  },
  {
    title: "Utility",
    icon: "/icons/Util.svg",
    items: [
      {
        title: "Get Price",
        type: "getPrice",
      },
      {
        title: "Create NFT Metadata",
        type: "createNftMetadata",
      },
    ],
  },
];
