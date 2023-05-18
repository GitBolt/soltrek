import KeypairNode from "./Crypto/Keypair";
import GetTokenDetailsNode from "./Explorer/GetTokenDetails";
import GetPriceNode from "./Util/GetPrice";
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
import HXROPariGet from "./SDKs/HXROParimutuel/GetPosition";
import HXROPariPlace from "./SDKs/HXROParimutuel/PlacePosition";
import HXROPariDestroy from "./SDKs/HXROParimutuel/DestroyPosition";
import HXROPariGetStore from "./SDKs/HXROParimutuel/GetStore";
import Mnemonic from "./Crypto/Mnemonic";
import SignMessage from "./Crypto/SignMessage";
import VerifyMessage from "./Crypto/VerifyMessage";
import HXROGetUserPositions from "./SDKs/HXROParimutuel/GetUserPosition";
import GetCandyMachine from "./SDKs/CandyMachine/GetCandyMachine";
import CandyMachineInput from "./SDKs/CandyMachine/CandyMachineInput";
import CreateCandyMachine from "./SDKs/CandyMachine/CreateCandyMachine";
import FileInputNode from "./Input/FileInput";
import GetSOLBalance from "./Explorer/GetSOLBalance";
import DeleteCandyMachine from "./SDKs/CandyMachine/DeleteCandyMachine";
import GetUserTokens from "./Explorer/GetUserTokenAccounts";
import InsertNFT from "./SDKs/CandyMachine/InsertNFT";
import MintNFT from "./SDKs/CandyMachine/MintNFT";
import FetchNFTs from "./SDKs/CandyMachine/FetchNFTs";
import CreateNFTMetadata from "./Util/CreateNFTMetadata";
import DexViewTRG from "./SDKs/HXRODexterity/ViewTRGAccount";
import DexCreateTRG from "./SDKs/HXRODexterity/CreateTRG";
import DexDepositAmount from "./SDKs/HXRODexterity/DepositAmount";
import DexWithdrawAmount from "./SDKs/HXRODexterity/WithdrawAmount";
import DexPlaceLimitOrder from "./SDKs/HXRODexterity/PlaceLimitOrder";
import DexCancelAllOrders from "./SDKs/HXRODexterity/CancelAllOrders";
import DexOrderbook from "./SDKs/HXRODexterity/Orderbook";

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
  fileInput: FileInputNode,
  getSOLBalance: GetSOLBalance,
  insertNft: InsertNFT,
  getUserTokens: GetUserTokens,
  fetchNFTs: FetchNFTs,
  mintNFT: MintNFT,
  createNftMetadata: CreateNFTMetadata,
  deleteCandyMachine: DeleteCandyMachine,
  dexViewTRG: DexViewTRG,
  dexCreateTRG: DexCreateTRG,
  dexDepositAmount: DexDepositAmount,
  dexWithdrawAmount: DexWithdrawAmount,
  dexPlaceLimitOrder: DexPlaceLimitOrder,
  dexCancelAllOrders: DexCancelAllOrders,
  dexOrderbook: DexOrderbook,
};
