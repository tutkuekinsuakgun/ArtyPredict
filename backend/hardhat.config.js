require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL; // veya Alchemy URL'nizi buraya ekleyin
const PRIVATE_KEY = process.env.PRIVATE_KEY; // MetaMask cüzdanınızın özel anahtarı (GÜVENLİK İÇİN ÇOK DİKKATLİ OLUN)

module.exports = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};
