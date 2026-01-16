import { ZeroAddress } from "ethers";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { BoosterUnitasProxyConfig, boosterUnitasProxyConfig } from "./config";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const deployImplOnly = process.env.DEPLOY_IMPL_ONLY === "true";

  const networkName = hre.network.name as keyof typeof boosterUnitasProxyConfig;
  const networkConfig: BoosterUnitasProxyConfig | undefined = boosterUnitasProxyConfig[networkName];
  if (!networkConfig) {
    throw new Error(`No booster configuration found for network ${hre.network.name}`);
  }

  const admin = networkConfig.admin === ZeroAddress ? deployer : networkConfig.admin;
  const multiSigWallet = networkConfig.multiSigWallet === ZeroAddress ? deployer : networkConfig.multiSigWallet;
  if (networkConfig.usdu === ZeroAddress) {
    throw new Error(`USDu address not set for network ${hre.network.name}`);
  }
  if (networkConfig.minting === ZeroAddress) {
    throw new Error(`Minting address not set for network ${hre.network.name}`);
  }
  if (networkConfig.staked === ZeroAddress) {
    throw new Error(`Staked address not set for network ${hre.network.name}`);
  }
  const usdu = networkConfig.usdu;
  const minting = networkConfig.minting;
  const staked = networkConfig.staked;

  const deploymentName = `BoosterUnitasProxy_${hre.network.name}_upgradeable`;
  const implementationDeploymentName = `BoosterUnitasProxy_${hre.network.name}_implementation`;

  if (deployImplOnly) {
    await deploy(implementationDeploymentName, {
      contract: "UnitasProxy",
      from: deployer,
      log: true,
    });
    deployments.log(`Deployed implementation only: ${implementationDeploymentName}`);
    return;
  }

  const existing = await deployments.getOrNull(deploymentName);
  if (existing) {
    deployments.log(`Deployment already exists, skipping: ${deploymentName}`);
    return;
  }

  await deploy(deploymentName, {
    contract: "UnitasProxy",
    from: deployer,
    log: true,
    proxy: {
      proxyContract: "OpenZeppelinTransparentProxy",
      owner: multiSigWallet,
      execute: {
        init: {
          methodName: "initialize",
          args: [admin, multiSigWallet, usdu, minting, staked],
        },
      },
    },
  });
};

func.id = "booster_unitas_proxy";
func.tags = ["BoosterUnitasProxy"];
export default func;
