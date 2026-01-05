import { getAddress, parseEther, ZeroAddress } from "ethers";

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
};