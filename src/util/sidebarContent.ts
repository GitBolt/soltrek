import { SidebarContentType } from '@/types/sidebar';

export const sidebarContent: SidebarContentType[] = [
  {
    title: "Input",
    icon: "/Input.svg",
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
    ],
  },
  {
    title: "Output",
    icon: "/Output.svg",
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
    icon: "/Crypto.svg",
    items: [
      {
        title: "Keypair",
        type: "keypair",
      },
      {
        title: "PDA",
        type: "PDA",
      },
    ],
  },
  {
    title: "Math",
    icon: "/Math.svg",
    items: [
      {
        title: "Add",
        type: "add",
      },
    ],
  },
  // {
  //   title: "Function",
  //   icon: "function",
  //   items: [
  //     {
  //       title: "Get Price",
  //       type: "getPrice",
  //     },
  //   ],
  // },
  {
    title: "SDKs",
    icon: "/SDK.svg",
    items: [
      {
        title: "HXRO Network",
        sub: [
          {
            title: "Pari - Get Contests",
            type: "hxroPariGet"
          },
          {
            title: "Pari - Place Position",
            type: "hxroPariPlace",
          },
        ]
      },

    ],
  },
  {
    title: "Explorer",
    icon: "/Explorer.svg",
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
    ],
  },
  {
    title: "Web3",
    icon: "/Web3.svg",
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
];
