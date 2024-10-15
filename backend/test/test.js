const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PredictionMarket", function () {
  let PredictionMarket;
  let predictionMarket;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    PredictionMarket = await ethers.getContractFactory("PredictionMarket");
    [owner, addr1, addr2, _] = await ethers.getSigners();
    predictionMarket = await PredictionMarket.deploy();
    await predictionMarket.deployed();
  });

  it("Should allow users to place bets", async function () {
    await predictionMarket.connect(addr1).placeBet(true, { value: ethers.utils.parseEther("1") });
    const bet = await predictionMarket.bets(addr1.address);
    expect(bet.amount).to.equal(ethers.utils.parseEther("1"));
    expect(bet.choice).to.equal(true);
  });

  it("Should not allow bets after market is closed", async function () {
    await predictionMarket.closeMarket(true);
    await expect(
      predictionMarket.connect(addr1).placeBet(true, { value: ethers.utils.parseEther("1") })
    ).to.be.revertedWith("Market is closed");
  });

  it("Should distribute rewards correctly", async function () {
    // Addr1 bets on 'true'
    await predictionMarket.connect(addr1).placeBet(true, { value: ethers.utils.parseEther("1") });
    // Addr2 bets on 'false'
    await predictionMarket.connect(addr2).placeBet(false, { value: ethers.utils.parseEther("1") });

    // Close market with outcome 'true'
    await predictionMarket.closeMarket(true);

    // Addr1 claims reward
    const initialBalance = await ethers.provider.getBalance(addr1.address);
    const tx = await predictionMarket.connect(addr1).claimReward();
    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);
    const finalBalance = await ethers.provider.getBalance(addr1.address);

    expect(finalBalance.sub(initialBalance).add(gasUsed)).to.equal(
      ethers.utils.parseEther("2")
    );
  });
});
