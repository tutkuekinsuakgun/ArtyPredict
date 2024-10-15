const { ethers } = require("hardhat");

async function main() {
  const PredictionMarket = await ethers.getContractFactory("PredictionMarket");
  const predictionMarket = await PredictionMarket.deploy();

  await predictionMarket.waitForDeployment();

  console.log("PredictionMarket deployed to:", predictionMarket.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
