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
import CreateTokenNode from "./Web3/CreateToken";
import SendToken from "./Web3/SendToken";
import SolanaPay from "./Web3/SolanaPay";
import GetTransactionNode from "./Explorer/GetTransaction";
import GetSNS from "./Explorer/GetSNS";
import HXROPariGet from "./SDKs/HXRO/PariGet";
import HXROPariPlace from "./SDKs/HXRO/PariPlace";
import HXROPariDestroy from "./SDKs/HXRO/PariDestroy";
import HXROPariGetStore from "./SDKs/HXRO/PariGetStore";
import Mnemonic from "./Crypto/Mnemonic";
import SignMessage from "./Crypto/SignMessage";
import VerifyMessage from "./Crypto/VerifyMessage";
import HXROGetUserPositions from "./SDKs/HXRO/GetUserPositions";
import GetCandyMachine from "./SDKs/CandyMachine/GetCandyMachine";
import CandyMachineInput from "./Input/CandyMachineInput";
import CreateCandyMachine from "./SDKs/CandyMachine/CreateCandyMachine";
import FileInputNode from "./Input/FileInput";

export const nodeTypes = {
  stringInput: StringInputNode,
  integerInput: IntegerInputNode,
  buttonInput: ButtonInputNode,
  textOutput: TextOutputNode,
  transaction: TransactionNode,
  colorOutput: ColorOutputNode,
  getTokenDetails: GetTokenDetailsNode,
  sendSOL: SendSOL,
  mnemonic: Mnemonic,
  keypair: KeypairNode,
  requestAirdrop: RequestAirdrop,
  add: AddNode,
  getPrice: GetPriceNode,
  signMessage: SignMessage,
  PDA: PDANode,
  createToken: CreateTokenNode,
  sendToken: SendToken,
  getSns: GetSNS,
  hxroPariGetUserPositions: HXROGetUserPositions,
  verifyMessage: VerifyMessage,
  hxroPariGet: HXROPariGet,
  hxroPariPlace: HXROPariPlace,
  hxroPariDestroy: HXROPariDestroy,
  hxroPariGetStore: HXROPariGetStore,
  getTransaction: GetTransactionNode,
  solanaPay: SolanaPay,
  candyMachineGet: GetCandyMachine,
  candyMachineCreate: CreateCandyMachine,
  candyMachineInput: CandyMachineInput,
  fileInput: FileInputNode
};
