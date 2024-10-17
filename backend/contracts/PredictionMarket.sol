// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PredictionMarket {
    struct Bet {
        uint256 amount;
        bool choice;
        bool claimed;
    }

    address public owner;
    bool public marketClosed;
    bool public outcome; // true or false
    uint256 public totalYesBets;
    uint256 public totalNoBets;

    mapping(address => Bet) public bets;

    constructor() {
        owner = msg.sender;
    }

    function placeBet(bool _choice) external payable {
        require(!marketClosed, "Market is closed");
        require(msg.value > 0, "Bet amount must be greater than zero");
        require(bets[msg.sender].amount == 0, "You have already placed a bet");

        bets[msg.sender] = Bet(msg.value, _choice, false);

        if (_choice) {
            totalYesBets += msg.value;
        } else {
            totalNoBets += msg.value;
        }
    }

    function closeMarket(bool _outcome) external {
        require(msg.sender == owner, "Only owner can close the market");
        require(!marketClosed, "Market already closed");

        marketClosed = true;
        outcome = _outcome;
    }

    function claimReward() external {
        require(marketClosed, "Market is not closed yet");
        Bet storage userBet = bets[msg.sender];
        require(userBet.amount > 0, "No bet placed");
        require(!userBet.claimed, "Reward already claimed");
        require(userBet.choice == outcome, "Your prediction was incorrect");

        uint256 reward;
        if (outcome) {
            reward = userBet.amount + (userBet.amount * totalNoBets) / totalYesBets;
        } else {
            reward = userBet.amount + (userBet.amount * totalYesBets) / totalNoBets;
        }

        userBet.claimed = true;
        payable(msg.sender).transfer(reward);
    }
}
