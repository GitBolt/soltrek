import GetPriceNode from "./Functions/GetPrice";
import ButtonInputNode from "./Input/ButtonInput";
import IntegerInputNode from "./Input/IntegerInput";
import StringInputNode from "./Input/StringInput";

export const nodeTypes = {
    stringInput: StringInputNode,
    integerInput: IntegerInputNode,
    buttonInput: ButtonInputNode,
    getPrice: GetPriceNode
  }