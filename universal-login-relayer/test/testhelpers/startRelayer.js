import {deployContract} from 'ethereum-waffle';
import WalletContract from '@universal-login/contracts/dist/contracts/Wallet.json';
import {deployFactory} from '@universal-login/contracts';
import Token from '../../src/http/relayers/abi/Token.json';
import ENSBuilder from 'ens-builder';
import {getContractWhiteList} from '../../src/http/relayers/RelayerUnderTest';
import {ETHER_NATIVE_TOKEN, deepMerge} from '@universal-login/commons';
import {getConfig} from '../../src/index';

const defaultDomain = 'mylogin.eth';

async function depolyEns(wallet) {
  const ensBuilder = new ENSBuilder(wallet);
  const [label, tld] = defaultDomain.split('.');
  return ensBuilder.bootstrapWith(label, tld);
}

async function startRelayer(wallet, RelayerConstructor) {
  const walletContract = await deployContract(wallet, WalletContract, [], {gasLimit: 5000000});
  const tokenContract = await deployContract(wallet, Token, []);
  const factoryContract = await deployFactory(wallet, walletContract.address);
  const ensAddress = await depolyEns(wallet);
  const overrideConfig = Object.freeze({
    jsonRpcUrl: 'http://localhost:18545',
    port: 33511,
    privateKey: wallet.privateKey,
    chainSpec: {
      ensAddress,
    },
    ensRegistrars: ['mylogin.eth'],
    walletContractAddress: walletContract.address,
    tokenContractAddress: tokenContract.address,
    contractWhiteList: getContractWhiteList(),
    factoryAddress: factoryContract.address,
    supportedTokens: [
      {
        address: tokenContract.address,
        minimalAmount: '0.5',
      },
      {
        address: ETHER_NATIVE_TOKEN.address,
        minimalAmount: '0.5',
      },
    ],
  });
  const config = deepMerge(getConfig('test'), overrideConfig);
  const relayer = new RelayerConstructor(config, wallet.provider);
  relayer.url = () => `http://localhost:${config.port}`;
  await relayer.start();
  return {relayer, tokenContract, factoryContract};
}

module.exports = {startRelayer, defaultDomain};