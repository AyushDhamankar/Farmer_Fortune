import React, { useState, useEffect } from "react";
import QuantityM from "../../assets/svg/minus.svg";
import QuantityP from "../../assets/svg/plus.svg";
import Bag from "../../assets/svg/shopping-bag.svg";
import { Link } from "react-router-dom";

const Card = ({
  id,
  img,
  title,
  quantity,
  desc,
  owner,
  price,
  myposts,
  state,
  role,
  transaction_id,
  create_post,
  quantity_display
}) => {
  const [quantityState, setQuantityState] = useState(0);
  const [farmer, setFarmer] = useState();

  async function getUser() {
    try {
      const { contract, web3 } = state;
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      
      // Check if there are accounts available
      if (accounts.length === 0) {
        console.error("No Ethereum accounts available");
        return;
      }
  
      const user = await contract.methods.User_Type_Mapping(accounts[0]).call();
      setFarmer(user.role);
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Handle the error (e.g., show a message to the user)
    }
  }

  useEffect(()=>{
    getUser();
  }, [state]);

  function shortenDescription(text) {
    if(text.length < 42) {
      return text;
    }
    const prefix = text.substring(0, 35);
    return `${prefix}...read more`;
  }

  const Distributor_to_Farmer = async (id, value) => {
    const { contract, web3 } = state;
    const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
    await contract.methods
      .Transfer_to_Farmer(Number(id))
      .send({ from: accounts[0], value: value, gas: 480000 });
  };

  const Vendor_to_Distributor = async (id, value) => {
    const { contract, web3 } = state;
    const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
    console.log(Number(value) * Number(quantityState));
    await contract.methods
      .Transfer_to_Distributor(id, quantityState)
      .send({ from: accounts[0], value: value * quantityState });
  };

  const Customer_to_Vendor = async (id, value) => {
    const { contract, web3 } = state;
    const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
    console.log(Number(value) * Number(quantityState));
    await contract.methods
      .Transfer_to_Vendor(id, quantityState)
      .send({ from: accounts[0], value: value * quantityState });
  };

  return (
    <div className="flex text-[#000000A8] border border-[#00000018] flex-col shadow-2xl rounded-lg w-[90%] md:w-[28vw]">
      <div>
        <img src={img} alt="" className="w-full" />
      </div>
      <div className={`${farmer == 0 && myposts != true ? "pb-0" : "pb-3"}`}>
        <div className="flex flex-col">
          <div className="flex border-b border-[#00000018] py-3 px-4 items-center justify-between">
            <p className="font-bold text-xl text-black">{title}</p>
            <p>Quantity : {quantity} Kg</p>
          </div>
          <div className="text-sm px-4 border-b border-[#00000018] py-3 text-text-gray capitalize">
            {shortenDescription(desc)}
          </div>
          <div className="flex px-4 py-3 items-center border-b border-[#00000018] justify-between">
            <p>
              <span>By </span>{" "}
              <span className="font-bold text-black">{owner}</span>
            </p>
            <p className="font-bold text-lg text-black">{price} ETH</p>
          </div>
          <div
            className={`flex px-4 justify-between items-center py-3 border-b border-[#00000018] ${
              role == 1 || myposts == true ? "hidden" : "flex"
            } ${quantity_display == true ? "hidden" : "flex" }` }
          >
            <p className="text-md text-black font-bold">Select Quantity</p>
            <div className="flex justify-between items-center w-[30%]">
              <img
                src={QuantityM}
                alt=""
                onClick={() =>
                  setQuantityState((p) => {
                    if (p > 1) {
                      return p - 1;
                    } else {
                      return 0;
                    }
                  })
                }
                className="h-8 cursor-pointer"
              />
              <p className="font-semibold text-black">{quantityState}</p>
              <img
                src={QuantityP}
                alt=""
                onClick={() => setQuantityState((p) => p + 1)}
                className="h-8 cursor-pointer"
              />
            </div>
          </div>
        </div>
        {myposts === true ? (
          <div className="flex justify-center items-center pt-3">
            <Link
              className={`px-4 cursor-pointer py-2 ${
                myposts ? "bg-black" : "bg-green"
              } text-white w-[80%] rounded-lg flex gap-2 items-center justify-center font-bold`}
              to={`/transactions/${id}/${role}/${true}`}
            >
              <img src={Bag} alt="" />
              <span>See Transactions</span>
            </Link>
          </div>
        ) : create_post === true ? (
          <div className="flex justify-center items-center pt-3">
            <Link
              className={`px-4 cursor-pointer py-2 ${
                myposts ? "bg-black" : "bg-green"
              } text-white w-[80%] rounded-lg flex gap-2 items-center justify-center font-bold`}
              to={`/transactions/${id}/${role}/${false}`}
            >
              <img src={Bag} alt="" />
              <span>Edit and Sell</span>
            </Link>
          </div>
        ) : (
        <div className={`flex justify-center items-center ${
          farmer == 0 ? "pt-0" : "pt-3"
        } `}>
          {role == 1 ? (
            <button
              className={`px-4 cursor-pointer py-2 ${
                myposts ? "bg-black" : "bg-green"
              } ${
                farmer == 0 ? "hidden" : "flex"
              } text-white w-[80%] rounded-lg flex gap-2 items-center justify-center font-bold`}
              onClick={(e) => {
                Distributor_to_Farmer(id, price);
              }}
            >
              <img src={Bag} alt="" />
              <span>Buy Now</span>
            </button>
          ) : role == 2 ? (
            <button
              className={`px-4 cursor-pointer py-2 ${
                myposts ? "bg-black" : "bg-green"
              } text-white w-[80%] rounded-lg flex gap-2 items-center justify-center font-bold`}
              onClick={(e) => {
                Vendor_to_Distributor(id, price);
              }}
            >
              <img src={Bag} alt="" />
              <span>Buy Now</span>
            </button>
          ) : role == 3 ? (
            <button
              className={`px-4 cursor-pointer py-2 ${
                myposts ? "bg-black" : "bg-green"
              } text-white w-[80%] rounded-lg flex gap-2 items-center justify-center font-bold`}
              onClick={(e) => {
                Customer_to_Vendor(id, price);
              }}
            >
              <img src={Bag} alt="" />
              <span>Buy Now</span>
            </button>
          ) : (
            <></>
          )}
        </div>
        )
        }
      </div>
    </div>
  );
};

export default Card;
