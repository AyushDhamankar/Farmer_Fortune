import React, { useState, useEffect } from "react";
import Metamask from "../../assets/logo/metamask.svg";
import { Link } from "react-router-dom";
import ABI from "./ABI.json";
import Web3 from "web3";
import Logo from "../../assets/logo/logo.png";

const Navbar = ({ saveState }) => {
  // handle connection to metamask
  const [connectedToMeta, setConnectedToMeta] = useState(false);
  const [usertype, setUserType] = useState("0");
  const [username, setUserName] = useState("");

  const init = async () => {
    try {
      // Check if Web3 is available
      if (window.ethereum) {
        // Initialize Web3 using MetaMask provider
        // const web3 = new Web3(window.ethereum);

        // Replace 'YOUR_ALCHEMY_API_KEY' with your actual Alchemy API key
        const alchemyApiKey = "_gda5EFG-n3zSegy8XdZfMkTORS8oWVd";

        // Use the Alchemy API URL for the Polygon Mumbai testnet
        const alchemyUrl =
          "https://polygon-mumbai.g.alchemy.com/v2/" + alchemyApiKey;

        const alchemyweb3 = new Web3(
          new Web3.providers.HttpProvider(alchemyUrl)
        );

        const web3 = new Web3(window.ethereum);

        // Connect to the contract using its ABI and address
        const contract = new web3.eth.Contract(
          ABI, // Replace with your contract's ABI
          "0x758c002516cE3f477103f6A8B56F8600EB911B43" // Replace with your contract's address
        );

        // Request user accounts from MetaMask
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        // Log user accounts
        console.log(accounts);

        // Save Web3 and contract in the application state
        saveState({
          alchemyweb3: alchemyweb3,
          web3: web3,
          contract: contract,
          accounts: accounts,
        });

        // Get user details from the contract
        const user = await contract.methods
          .User_Type_Mapping(accounts[0])
          .call();
        console.log(user);

        // Set user details in component state
        setUserName(user.name);
        setUserType(user.role);

        // Set flag indicating connection to MetaMask
        setConnectedToMeta(true);

        // Log the contract for debugging
        console.log(contract);
      } else {
        // Handle case where MetaMask is not available
        console.error("MetaMask is not available");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    // Implement logout functionality here
    saveState({ web3: null, contract: null });
    setUserName("");
    setUserType("");
    setConnectedToMeta(false);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <header className="flex md:sticky top-0 z-[100] md:backdrop-blur-3xl md:px-16 px-6 text-gray-600  w-full justify-between md:py-2 flex-col md:flex-row items-center h-[12vh]">
      <div className="flex w-full items-center text-gray-900 mb-4 md:mb-0 md:w-36 h-full">
        <Link to={"/"} className="ml-3 text-4xl font-bold h-full">
          <img src={Logo} alt="" className="w-full h-full" />
        </Link>
      </div>
      <nav className="font-medium flex flex-wrap items-center text-base gap-x-5 justify-center">
        <Link to="/explore" className=" hover:text-gray-900 cursor-pointer">
          Explore
        </Link>
        <Link
          to="/farmer_create"
          className=" hover:text-gray-900 cursor-pointer"
        >
          Create Post
        </Link>
        <Link to="/mypost" className=" hover:text-gray-900 cursor-pointer">
          My Post
        </Link>
      </nav>
      <div
        onClick={connectedToMeta ? handleLogout : init}
        className={` ${
          connectedToMeta ? "flex-row" : "flex-row-reverse"
        } flex cursor-pointer duration-300 transition-all items-center max-md:pt-5"`}
      >
        {!connectedToMeta ? (
          <button
            className={`items-center  text-white bg-black border border-black py-1.5 pl-6 px-4 focus:outline-none hover:bg-gray-200 rounded-2xl text-base md:mt-0 font-medium max-md:hidden flex`}
          >
            Connect Metamask
          </button>
        ) : (
          <button
            className={`items-center text-black bg-[#ffffff80] border border-black py-1 md:py-1.5 pr-6 px-4 focus:outline-none hover:bg-gray-200 rounded-2xl text-base md:mt-0 font-medium max-md:top-4 max-md:absolute max-md:right-7 flex`}
          >
            {username != "" ? username : "New User"}{" "}
            {usertype == 0 && username != ""
              ? "(F)"
              : usertype == 1 && username != ""
              ? "(D)"
              : usertype == 2 && username != ""
              ? "(V)"
              : usertype == 3 && username != ""
              ? "(C)"
              : ""}
          </button>
        )}
        <img
          src={Metamask}
          alt=""
          className={` ${
            connectedToMeta ? "md:-ml-4 " : "md:-mr-4"
          }  max-md:absolute max-md:mr-3 max-md:mt-3.5 max-md:top-0 max-md:right-0 z-[100] h-10`}
        />
      </div>
    </header>
  );
};

export default Navbar;
