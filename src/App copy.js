import { ethers, providers } from "ethers";
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'

import { useState, useEffect } from 'react';

export default function Home(props) {

  const [web3Modal, setWeb3Modal] = useState(null)
  const [address, setAddress] = useState("")

  useEffect(() => {
    // initiate web3modal
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: "f9749eb5954545a98c29ebb8be2d8056"
        }
      },
    };

    const newWeb3Modal = new Web3Modal({
      cacheProvider: true, // very important
      network: "rinkeby",
      providerOptions,
    });

    setWeb3Modal(newWeb3Modal)
  }, [])

  useEffect(() => {
    // connect automatically and without a popup if user is already connected
    if (web3Modal && web3Modal.cachedProvider) {
      connectWallet()
    }
  }, [web3Modal])

  async function connectWallet() {
    const provider = await web3Modal.connect();

    addListeners(provider);

    const ethersProvider = new providers.Web3Provider(provider)
    const userAddress = await ethersProvider.getSigner().getAddress()
    setAddress(userAddress)
  }

  async function addListeners(web3ModalProvider) {

    web3ModalProvider.on("accountsChanged", (accounts) => {
      window.location.reload()
    });

    // Subscribe to chainId change
    web3ModalProvider.on("chainChanged", (chainId) => {
      window.location.reload()
    });
  }

  return (
    <div>
      <button onClick={connectWallet}>Connect wallet</button>
      <p>{address}</p>
    </div>
  )

}