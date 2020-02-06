import {expect} from 'chai';
import {utils} from 'ethers';
import {TEST_PRIVATE_KEY, ETHER_NATIVE_TOKEN} from '../../../src';
import {getTestSignedMessage} from '../../helpers/getTestMessage';
import {getFeeCurrencyValueFrom} from '../../../src/core/utils/getFeeCurrencyValueFrom';

describe('UNIT: getFeeCurrencyValueFrom', () => {
  describe('ETH', () => {
    it('return balance eq 0 when gasPrice is 0', () => {
      const signedMessage = getTestSignedMessage(TEST_PRIVATE_KEY, {gasPrice: 0, safeTxGas: 100, baseGas: 1000, gasToken: ETHER_NATIVE_TOKEN.address});
      expect(getFeeCurrencyValueFrom(signedMessage)).to.be.deep.eq({
        address: ETHER_NATIVE_TOKEN.address,
        balance: utils.bigNumberify('0'),
      });
    });

    it('return balance eq 0 when gas limit is 0', () => {
      const signedMessage = getTestSignedMessage(TEST_PRIVATE_KEY, {gasPrice: 100000, safeTxGas: 0, baseGas: 0, gasToken: ETHER_NATIVE_TOKEN.address});
      expect(getFeeCurrencyValueFrom(signedMessage)).to.be.deep.eq({
        address: ETHER_NATIVE_TOKEN.address,
        balance: utils.bigNumberify('0'),
      });
    });

    it('return balance eq 5500', () => {
      const signedMessage = getTestSignedMessage(TEST_PRIVATE_KEY, {gasPrice: 5, safeTxGas: 100, baseGas: 1000, gasToken: ETHER_NATIVE_TOKEN.address});
      expect(getFeeCurrencyValueFrom(signedMessage)).to.be.deep.eq({
        address: ETHER_NATIVE_TOKEN.address,
        balance: utils.bigNumberify('5500'),
      });
    });
  });
});
