require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

// Đọc biến môi trường từ .env
const {
  ARC_TESTNET_RPC_URL,
  DEPLOYER_PRIVATE_KEY,
} = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  networks: {
    hardhat: {
      chainId: 31337,
    },

    // Arc Testnet - mạng chính để deploy
    arcTestnet: {
      url: ARC_TESTNET_RPC_URL || "https://rpc.testnet.arc.network",
      chainId: 5042002,
      accounts: DEPLOYER_PRIVATE_KEY
        ? [`0x${DEPLOYER_PRIVATE_KEY.replace(/^0x/, "")}`]
        : [],
    },
  },
};

module.exports = config;
