import KeypairNode from "./Crypto/Keypair";
import GetTokenDetailsNode from "./Explorer/GetTokenDetails";
import GetPriceNode from "./Functions/GetPrice";
import ButtonInputNode from "./Input/ButtonInput";
import IntegerInputNode from "./Input/IntegerInput";
import StringInputNode from "./Input/StringInput";
import AddNode from "./Math/AddNode";
import ColorOutputNode from "./Output/ColorOutput";
import TextOutputNode from "./Output/TextOutput";
import TransactionNode from "./Web3/Transaction";
import PDANode from "./Crypto/PDA";
import RequestAirdrop from "./Web3/RequestAirdrop";

export const nodeTypes = {
  stringInput: StringInputNode,
  integerInput: IntegerInputNode,
  buttonInput: ButtonInputNode,
  textOutput: TextOutputNode,
  transaction: TransactionNode,
  colorOutput: ColorOutputNode,
  getTokenDetails: GetTokenDetailsNode,
  keypair: KeypairNode,
  requestAirdrop: RequestAirdrop,
  add: AddNode,
  getPrice: GetPriceNode,
  PDA: PDANode,
};
