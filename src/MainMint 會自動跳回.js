import { useState } from "react";
import Web3Modal from "web3modal";
import { ethers, BigNumber } from "ethers";
import { Button, Input } from '@mui/material';
import { providerOptions } from "./providerOptions";
import mccmNFT from './MccmNFT.json';

const mccmNFTAddress = "0xA7DAbee8C46ae49EE9eAdd1d870DC7c249db363a";

const web3Modal = new Web3Modal({
    network: "rinkeby", // optional
    cacheProvider: true, // optional
    providerOptions // required
});

const MainMint = ({ accounts, setAccounts }) => {
    const [mintAmount, setMintAmount] = useState();
    const isConnected = Boolean(accounts[0]);

    const [provider, setProvider] = useState();
    const [library, setLibrary] = useState();
    const [account, setAccount] = useState();
    const [chainId, setChainId] = useState();
    const [error, setError] = useState("");

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

    const disconnect = async () => {
        await web3Modal.clearCachedProvider();
        refreshState();
    };
    const refreshState = () => {
        setAccount();
        setChainId();
    };

    async function handleMint() {
        const formData = new FormData(document.getElementById('form'));
        const aa = formData.get('name');
        console.log("aaa", aa);
        const provider = await web3Modal.connect();
        const library = new ethers.providers.Web3Provider(provider);
        const signer = library.getSigner();
        const contract = new ethers.Contract(
            mccmNFTAddress,
            mccmNFT.abi,
            signer
        );

        try {
            console.log('bignumber: ', mintAmount);
            const response = await contract.mintMccmMeta(formData.get('name'), {
                value: ethers.utils.parseEther((0.003 * formData.get('name')).toString()),
            });
            console.log('response: ', response);
        } catch (err) {
            console.log("error: ", err)
        }
    }
    /* const handleDecrement = () => {
         if (mintAmount <= 1) return;
         setMintAmount(mintAmount - 1);
     };
 
     const handleIncrement = () => {
         if (mintAmount >= 10) return;
         setMintAmount(mintAmount + 1);
     };*/




    return (
        <>

            <Button onClick={connectWallet} color="secondary" variant="contained">Connect Wallet</Button>
            <form id="form">

                <input type="number" name="name" />
                <button onClick={handleMint}>Mint now</button>
            </form>


        </>

    )

}
export default MainMint;

/*
import { useState } from "react";
import { ethers, BigNumber } from 'ethers';
import { Box, Button, Flex } from '@chakra-ui/react';
import mccmNFT from './MccmNFT.json';

const mccmNFTAddress = "0x5cB1134Cd6D61B25eE3B65760369bAE860A7Ae48";

const MainMint = ({ accounts, setAccounts }) => {
    const [mintAmount, setMintAmount] = useState(1);
    const isConnected = Boolean(accounts[0]);

    async function connectAccount() {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            setAccounts(accounts);
        }
    }

    async function handleMint() {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                mccmNFTAddress,
                mccmNFT.abi,
                signer
            );
            try {
                const response = await contract.mintMccmMeta(BigNumber.from(mintAmount), {
                    value: ethers.utils.parseEther((0.003 * mintAmount).toString()),
                });
                console.log('response: ', response);
            } catch (err) {
                console.log("error: ", err)
            }

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

    return (
        <Flex justify="center" align="center" height="100vh" paddingBottom="150px">
            <Box width="520px">
                <div>
                    <h1>Mansion Cat Club！Meow～</h1>
                    <p>!!!!!!歡迎加入豪宅貓俱樂部！喵嗚～，讓我們一同完成心願。 </p>
                </div>
{
    isConnected ? (
        <Box margin="0 15px">Connected</Box>
    ) : (
        <Button
            background="#D6517D"
            borderRadius="5px"
            boxShadow="0px 2px 2px 1px #0F0F0F"
            color="white"
            cursor="pointer"
            fontFamily="inherit"
            padding="15px"
            margin="0 15px"
            onClick={connectAccount}
        >
            Connect
        </Button>
    )
}
{
    isConnected ? (
        <div>
            <div>
                <button onClick={handleDecrement}>-</button>
                <input type="number" value={mintAmount} />
                <button onClick={handleIncrement}>+</button>
            </div>
            <button onClick={handleMint}>Mint now</button>
        </div>
    ) : (
        <p>You must be connected to Mint.</p>
    )
}
            </Box >
        </Flex >
    );
};


export default MainMint;
*/