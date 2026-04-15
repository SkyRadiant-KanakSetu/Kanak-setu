import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../infra/.env.example') });

const config: HardhatUserConfig = {
  solidity: '0.8.20',
  networks: {
    hardhat: {},
    bharatchain: {
      url:
        process.env.BHARATCHAIN_RPC_URL ||
        process.env.BLOCKCHAIN_RPC_URL ||
        process.env.POLYGON_RPC_URL ||
        'https://rpc.bharatchain.org',
      accounts: process.env.ANCHOR_PRIVATE_KEY ? [process.env.ANCHOR_PRIVATE_KEY] : [],
      chainId: Number(process.env.CHAIN_ID || 2410),
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
