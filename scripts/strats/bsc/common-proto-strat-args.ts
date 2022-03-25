import { StratProtocolBase } from "../../../utils/deploy-util";
import { TOKENS } from "../../data/tokens";
import { PAIR_AMETHYST_UST_ADDRESS } from "./bsc-addresses";


export const STRAT_PROTOCOL_ARGS: StratProtocolBase = {
    _protocolLp0Route: [TOKENS.UST.BSC],
    _protocolLp1Route: [TOKENS.UST.BSC, TOKENS.AMETHYST.BSC],
    _protocolPairAddress: PAIR_AMETHYST_UST_ADDRESS,
    _burnTokenAddress: TOKENS.AMETHYST.BSC,
    _nativeToBuybackRoute: [TOKENS.UST.BSC, TOKENS.AMETHYST.BSC]
}