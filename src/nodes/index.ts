import KeypairNode from "./Crypto/Keypair";
import GetTokenDetailsNode from "./Explorer/GetTokenDetails";
import GetPriceNode from "./Functions/GetPrice";
import ButtonInputNode from "./Input/ButtonInput";
import IntegerInputNode from "./Input/IntegerInput";
import StringInputNode from "./Input/StringInput";
import AddNode from "./Math/AddNode";
import ColorOutputNode from "./Output/ColorOutput";
import TextOutputNode from "./Output/TextOutput";
import SendSOL from "./Web3/SendSOL";
import TransactionNode from "./Web3/Transaction";
import PDANode from "./Crypto/PDA";
import RequestAirdrop from "./Web3/RequestAirdrop";
import CreateTokenNode from "./Web3/createToken";
import SendToken from "./Web3/sendTokens";
import { sendSOL } from "@/util/sendToken";

export const nodeTypes = {
  stringInput: StringInputNode,
  integerInput: IntegerInputNode,
  buttonInput: ButtonInputNode,
  textOutput: TextOutputNode,
  transaction: TransactionNode,
  colorOutput: ColorOutputNode,
  getTokenDetails: GetTokenDetailsNode,
  sendSOL: SendSOL,
  keypair: KeypairNode,
  requestAirdrop: RequestAirdrop,
  add: AddNode,
  getPrice: GetPriceNode,
  PDA: PDANode,
  createToken: CreateTokenNode,
  sendToken: SendToken,
};
