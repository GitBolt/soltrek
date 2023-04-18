import InputIcon from '@/imgs/icons/input.svg'
import { SidebarContentType } from '@/types/sidebar';

export const sidebarContent: SidebarContentType[] = [
  {
    title: "Input",
    icon: InputIcon,
    items: [
      {
        title: "String Input",
        sub:[
          {
            title: "Test",
            type: "hi"
          }
        ]
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
    icon: "",
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
    icon: "",
    items:[
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
    icon: "math",
    items:[
      {
        title: "Add",
        type: "add",
      },
    ],
  },
  {
    title: "Function",
    icon: "function",
    items:[
      {
        title: "Get Price",
        type: "getPrice",
      },
    ],
  },
  {
    title: "SDKs",
    icon: "sdks",
    items:[
      {
        title: "HXRO Pari Get",
        type: "hxroPariGet",
      },
      {
        title: "HXRO Pari Place",
        type: "hxroPariPlace",
      },
    ],
  },
  {
    title: "Explorer",
    icon: "Explorer",
    items:[
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
    icon: "Web3",
    items:[
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
