
import { useEffect, useState } from "react";
//import {VStack, Button, Text, HStack, Select, Input, Box} from "@chakra-ui/react";
//import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
//import { Tooltip } from "@chakra-ui/react";
//import { networkParams } from "./networks";
//import { toHex, truncateAddress } from "./utils";
import Button from '@mui/material/Button';
import { ethers, BigNumber } from "ethers";
import Web3Modal from "web3modal";
import { providerOptions } from "./providerOptions";
import mccmNFT from './MccmNFT.json';

const mccmNFTAddress = "0x5cB1134Cd6D61B25eE3B65760369bAE860A7Ae48";

const web3Modal = new Web3Modal({
  cacheProvider: true, // optional
  providerOptions // required
});

export default function Home() {
  const [mintAmount, setMintAmount] = useState(1);
  const [provider, setProvider] = useState();
  const [library, setLibrary] = useState();
  const [account, setAccount] = useState();
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");
  const [chainId, setChainId] = useState();
  const [network, setNetwork] = useState();
  const [message, setMessage] = useState("");
  const [signedMessage, setSignedMessage] = useState("");
  const [verified, setVerified] = useState();

  const connectWallet = async () => {
    try {
      const provider = await web3Modal.connect();
      const library = new ethers.providers.Web3Provider(provider);
      const accounts = await library.listAccounts();
      const network = await library.getNetwork();
      setProvider(provider);
      setLibrary(library);
      if (accounts) setAccount(accounts[0]);
      setChainId(network.chainId);
    } catch (error) {
      setError(error);
    }
  };

  async function handleMint() {
    const provider = await web3Modal.connect();
    const library = new ethers.providers.Web3Provider(provider);
    const signer = library.getSigner();
    console.log("eeeeeeee", signer);
    const contract = new ethers.Contract(
      mccmNFTAddress,
      mccmNFT.abi,
      signer
    );
    try {
      console.log("ffffffff");
      const response = await contract.mintMccmMeta(BigNumber.from(mintAmount), {
        value: ethers.utils.parseEther((0.003 * mintAmount).toString()),
      });
      console.log('response: ', response);
    } catch (err) {
      console.log("error: ", err)
    }
  }
  const handleDecrement = () => {
    if (mintAmount <= 1) return;
    setMintAmount(mintAmount - 1);
  };

  const handleIncrement = () => {
    if (mintAmount >= 10) return;
    setMintAmount(mintAmount + 1);
  };

  /*
    const handleNetwork = (e) => {
      const id = e.target.value;
      setNetwork(Number(id));
    };
  
    const handleInput = (e) => {
      const msg = e.target.value;
      setMessage(msg);
    };
  
    const switchNetwork = async () => {
      try {
        await library.provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: toHex(network) }]
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await library.provider.request({
              method: "wallet_addEthereumChain",
              params: [networkParams[toHex(network)]]
            });
          } catch (error) {
            setError(error);
          }
        }
      }
    };
  
    const signMessage = async () => {
      if (!library) return;
      try {
        const signature = await library.provider.request({
          method: "personal_sign",
          params: [message, account]
        });
        setSignedMessage(message);
        setSignature(signature);
      } catch (error) {
        setError(error);
      }
    };
  
    const verifyMessage = async () => {
      if (!library) return;
      try {
        const verify = await library.provider.request({
          method: "personal_ecRecover",
          params: [signedMessage, signature]
        });
        setVerified(verify === account.toLowerCase());
      } catch (error) {
        setError(error);
      }
    };
  */
  const refreshState = () => {
    setAccount();
    setChainId();
    setNetwork("");
    setMessage("");
    setSignature("");
    setVerified(undefined);
  };

  const disconnect = async () => {
    await web3Modal.clearCachedProvider();
    refreshState();
  };

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts) => {
        console.log("accountsChanged", accounts);
        if (accounts) setAccount(accounts[0]);
      };

      const handleChainChanged = (_hexChainId) => {
        setChainId(_hexChainId);
      };

      const handleDisconnect = () => {
        console.log("disconnect", error);
        disconnect();
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);

      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider]);

  return (
    <>
      <h1>
        If you're in the sandbox, first "Open in New Window"
      </h1>


      <h2>
        Let's connect with
      </h2>
      <h3>
        MCCM NFT
      </h3>

      {!account ? (
        <Button onClick={connectWallet} color="secondary" variant="contained">Connect Wallet</Button>
      ) : (
        <Button onClick={disconnect}>Disconnect</Button>
      )}
      <div>
        <button onClick={handleDecrement}>-</button>
        <input type="number" value={mintAmount} />
        <button onClick={handleIncrement}>+</button>
      </div>

      <h1>{error ? error.message : null}</h1>
      <button onClick={handleMint}>Mint now</button>
      <input type="number" value={mintAmount} />
    </>
  );
}




//Web3Modal: How to Connect Multiple Wallets to your Dapp Fast and Easy!//
/*
import './App.css';
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { CoinbaseWalletSDK } from "@coinbase/wallet-sdk";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useState } from 'react';

const providerOptions = {
  coinbasewallet: {
    package: CoinbaseWalletSDK, // Required
    options: {
      appName: "My Awesome App", // Required
      infuraId: "f9749eb5954545a98c29ebb8be2d8056"
    }
  },
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: "f9749eb5954545a98c29ebb8be2d8056" // required
    }
  },
};
function App() {
  const [Web3Provider, setWeb3Provider] = useState(null);
  async function connectWallet() {
    try {
      let web3modal = new Web3Modal({
        cacheProvider: false,
        providerOptions,
      });
      const web3ModalInstance = await web3modal.connect();
      const web3ModalProvider = new ethers.providers.Web3Provider(web3ModalInstance);
      console.log(web3ModalProvider);
      if (web3ModalProvider) {
        setWeb3Provider(web3ModalProvider)
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <h1>Web3Modal Connection!</h1>
        <button onClick={connectWallet}>
          Connect Wallet
        </button>
      </header>
    </div>
  );
}
export default App;
*/

/*
import { useState } from 'react';
import './App.css';
import MainMint from './MainMint';


function App() {
  const [accounts, setAccounts] = useState([]);

  return (
    <div className='overlay'>
      <div className="App">
        <MainMint accounts={accounts} setAccounts={setAccounts} />
      </div>
      <div className="moving-background"></div>
    </div>
  );
}

export default App;
*/


