import {SignedMessage} from '@universal-login/commons';
import {utils} from 'ethers';

export default interface IWalletContractService {
  keyExist: (walletAddress: string, key: string) => Promise<boolean>;
  calculateMessageHash: (message: SignedMessage) => Promise<string> | string;
  recoverSignerFromMessage: (message: SignedMessage) => Promise<string> | string;
  getRequiredSignatures: (walletAddress: string) => Promise<utils.BigNumber>;
  fetchMasterAddress: (walletAddress: string) => Promise<string>;
}