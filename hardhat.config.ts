require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

// Đọc biến môi trường từ .env
const {
  ARC_TESTNET_RPC_URL,
  ARC_MAINNET_RPC_URL,
  DEPLOYER_PRIVATE_KEY,
} = process.env;

const deployerAccounts = DEPLOYER_PRIVATE_KEY
  ? [`0x${DEPLOYER_PRIVATE_KEY.replace(/^0x/, "")}`]
  : [];

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
      accounts: deployerAccounts,
    },

    // Arc Mainnet - dùng cho script deploy:arcMainnet.
    // chainId để hardhat tự phát hiện từ RPC (điền lại khi có số chính thức).
    arcMainnet: {
      url: ARC_MAINNET_RPC_URL || "https://rpc.arc.network",
      accounts: deployerAccounts,
    },
  },
};

module.exports = config;
