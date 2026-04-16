import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../infra/.env.example') });

const config: HardhatUserConfig = {
  solidity: '0.8.20',
  networks: {
    hardhat: {},
    amoy: {
      url: process.env.POLYGON_RPC_URL || 'https://rpc-amoy.polygon.technology',
      accounts: process.env.ANCHOR_PRIVATE_KEY ? [process.env.ANCHOR_PRIVATE_KEY] : [],
      chainId: 80002,
    },
    polygon: {
      url: 'https://polygon-rpc.com',
      accounts: process.env.ANCHOR_PRIVATE_KEY ? [process.env.ANCHOR_PRIVATE_KEY] : [],
      chainId: 137,
    },
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
};

export default config;
