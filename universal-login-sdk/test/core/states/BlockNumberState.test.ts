import {expect} from 'chai';
import {MockProvider} from 'ethereum-waffle';
import {Wallet} from 'ethers';
import sinon from 'sinon';
import {waitUntil} from '@unilogin/commons';
import {mineBlock} from '@unilogin/contracts/testutils';
import {ProviderService} from '@unilogin/contracts';
import {BlockNumberState} from '../../../src/core/states/BlockNumberState';

describe('INT: BlockNumberState', () => {
  let provider;
  let wallet: Wallet;
  let state: BlockNumberState;
  let callback: any;

  it('no subscriptions', () => {
    const providerService = new ProviderService(new MockProvider());
    state = new BlockNumberState(providerService);
    expect(state.get()).to.eq(0);
  });

  describe('1 subscription', () => {
    beforeEach(() => {
      provider = new MockProvider();
      [wallet] = provider.getWallets();
      provider.pollingInterval = 1;
      state = new BlockNumberState(new ProviderService(provider));
      callback = sinon.spy();
    });

    it('no blocks', async () => {
      const unsubscribe = state.subscribe(callback);

      await waitUntil(() => !!callback.firstCall);
      expect(callback).to.have.been.calledOnce;
      expect(state.get()).to.eq(0);

      unsubscribe();
      expect(state.get()).to.eq(0);
    });

    it('1 block', async () => {
      const unsubscribe = state.subscribe(callback);
      console.log('agfter get unsub');
      mineBlock(wallet);
      console.log('agfter mine');

      await waitUntil(() => !!callback.firstCall);
      console.log('agfter wait');

      expect(state.get()).to.eq(1);

      unsubscribe();
      console.log('agfter unsub');

      expect(state.get()).to.eq(1);
    });

    it('2 blocks', async () => {
      const unsubscribe = state.subscribe(callback);
      mineBlock(wallet);

      await waitUntil(() => !!callback.secondCall);
      expect(state.get()).to.eq(1);
      mineBlock(wallet);
      await waitUntil(() => !!callback.thirdCall);
      expect(state.get()).to.eq(2);

      unsubscribe();
      expect(state.get()).to.eq(2);
    });
  });

  describe('2 subscriptions', () => {
    beforeEach(() => {
      provider = new MockProvider();
      [wallet] = provider.getWallets();
      provider.pollingInterval = 1;
      const providerService = new ProviderService(provider);
      state = new BlockNumberState(providerService);
      callback = sinon.spy();
    });

    it('2 blocks', async () => {
      const callback2 = sinon.spy();
      const unsubscribe1 = state.subscribe(callback);
      const unsubscribe2 = state.subscribe(callback2);
      await waitUntil(() => !!callback.firstCall);
      await waitUntil(() => !!callback2.firstCall);
      expect(state.get()).to.eq(0);

      await mineBlock(wallet);
      await waitUntil(() => !!callback.secondCall);
      await waitUntil(() => !!callback2.secondCall);
      expect(state.get()).to.eq(1);

      await mineBlock(wallet);
      await waitUntil(() => !!callback.thirdCall);
      await waitUntil(() => !!callback2.thirdCall);
      expect(state.get()).to.eq(2);

      unsubscribe1();
      unsubscribe2();

      expect(state.get()).to.eq(2);
    });
  });
});
