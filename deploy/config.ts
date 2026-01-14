import { getAddress, ZeroAddress } from "ethers";

export type BoosterUnitasProxyConfig = {
  admin: string;
  multiSigWallet: string;
  usdu: string;
  minting: string;
  staked: string;
};

export const boosterUnitasProxyConfig: Record<string, BoosterUnitasProxyConfig> = {
  bsc_testnet: {
    admin: ZeroAddress,
    multiSigWallet: ZeroAddress,
    usdu: getAddress("0x029544a6ef165c84A6E30862C85B996A2BF0f9dE"),
    minting: getAddress("0x84E5D5009ab4EE5eCf42eeA5f1B950d39eEFb648"),
    staked: getAddress("0x3E7fF623C4Db0128657567D583df71E0297dfcc3"),
  },
  bsc_mainnet: {
    admin: getAddress("0x25f9f26F954ED5F8907dF2a5f69776aD8564792C"),
    multiSigWallet: getAddress("0x29980fd30951B7f8B767555FE0b21cf98C814336"),
    usdu: getAddress("0xeA953eA6634d55dAC6697C436B1e81A679Db5882"),
    minting: getAddress("0xbB984CE670100AA855f6152f88b26EE57f4EA82A"),
    staked: getAddress("0x385C279445581a186a4182a5503094eBb652EC71"),
  }
};