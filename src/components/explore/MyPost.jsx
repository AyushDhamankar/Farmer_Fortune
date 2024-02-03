import React from "react";
import Card from "../common/Card";
import { useState, useEffect } from "react";
import { Skeletoncard } from "../common/SkeletonCard";

const MyPost = ({ state }) => {
  const [farmerPosts, setFarmerPosts] = useState([]);
  const [role, setRole] = useState();
  const [loadData, setLoadData] = useState(false);

  async function getFarmerPost(length) {
    const { contract, web3, accounts } = state;
    // const accounts = await window.ethereum.request({
    //   method: "eth_requestAccounts",
    // });
    const filteredPosts = [];

    for (let i = 0; i < length; i++) {
      const farmerPost = await contract.methods.Farmer_Post_Array(i).call();
      console.log(`Farmer_Post[${i}]:`, farmerPost);

      if (
        farmerPost.Farmer_address.toLowerCase() === accounts[0].toLowerCase()
      ) {
        farmerPost.id = farmerPost.Farmer_Post_id;
        farmerPost.price = farmerPost.Farmer_price;
        farmerPost.transaction_id = farmerPost.Farmer_Post_id;
        filteredPosts.push(farmerPost);
      }
    }
    setFarmerPosts(filteredPosts);
    setLoadData(false);
    console.log(filteredPosts);
  }

  async function getDistributorPost(length) {
    const { contract, web3, accounts } = state;
    // const accounts = await window.ethereum.request({
    //   method: "eth_requestAccounts",
    // });
    const filteredPosts = [];

    for (let i = 0; i < length; i++) {
      const farmerPost = await contract.methods
        .Distributor_Post_Array(i)
        .call();
      console.log(`Farmer_Post[${i}]:`, farmerPost);

      if (
        farmerPost.Distributor_address.toLowerCase() ===
        accounts[0].toLowerCase()
      ) {
        farmerPost.id = farmerPost.Distributor_Post_id;
        farmerPost.price = farmerPost.Distributor_price;
        farmerPost.transaction_id = farmerPost.transactions_id;
        filteredPosts.push(farmerPost);
      }
    }
    setFarmerPosts(filteredPosts);
    setLoadData(false);
    console.log(filteredPosts);
  }

  async function getVendorPost(length) {
    const { contract, web3, accounts } = state;
    // const accounts = await window.ethereum.request({
    //   method: "eth_requestAccounts",
    // });
    const filteredPosts = [];

    for (let i = 0; i < length; i++) {
      const farmerPost = await contract.methods.Vendor_Post_Array(i).call();
      console.log(`Farmer_Post[${i}]:`, farmerPost);

      if (
        farmerPost.Vendor_address.toLowerCase() === accounts[0].toLowerCase() &&
        farmerPost.status == 0
      ) {
        farmerPost.id = farmerPost.Vendor_Post_id;
        farmerPost.price = farmerPost.Vendor_price;
        farmerPost.transaction_id = farmerPost.transactions_id;
        filteredPosts.push(farmerPost);
      }
    }
    setLoadData(false);
    setFarmerPosts(filteredPosts);
    console.log(filteredPosts);
  }

  async function getVendorPost1(length) {
    const { contract, web3, accounts } = state;
    // const accounts = await web3.eth.getAccounts();
    const filteredPosts = [];

    for (let i = 0; i < length; i++) {
      const farmerPost = await contract.methods.Vendor_Post_Array(i).call();
      console.log(`Farmer_Post[${i}]:`, farmerPost);

      if (
        farmerPost.Vendor_address.toLowerCase() === accounts[0].toLowerCase()
      ) {
        farmerPost.id = farmerPost.Vendor_Post_id;
        farmerPost.price = farmerPost.Vendor_price;
        farmerPost.transaction_id = farmerPost.transactions_id;
        filteredPosts.push(farmerPost);
      }
    }
    setFarmerPosts(filteredPosts);
    setLoadData(false);
    console.log(filteredPosts);
  }

  async function getFarmerPostData(indices) {
    try {
      const { contract, web3 } = state;
      // Array to store results
      const results = [];
      console.log(indices);

      for (let i = 0; i < indices.length; i++) {
        const result = await contract.methods
          .Vendor_Post_Array(indices[i])
          .call();
        result.id = result.Vendor_Post_id;
        result.price = result.Vendor_price;
        results.push(result);
      }
      console.log(results);
      setLoadData(false);
      setFarmerPosts(results);
      console.log("Farmer Post Data:", results);
    } catch (error) {
      console.error("Error calling Farmer_Post_Array:", error);
    }
  }

  const get_Own_Product = async () => {
    try {
      const { contract, web3, accounts } = state;
      // const accounts = await web3.eth.getAccounts();
      console.log("Distributor");
      const distributor = await contract.methods
        .get_Owned_Properties(accounts[0], 2)
        .call();
      console.log("Hiii", distributor);
      await getFarmerPostData(distributor);
    setLoadData(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to fetch Farmer_Posts
  async function fetchFarmerPosts() {
    try {
      setLoadData(true);
      const { contract, web3, accounts } = state;
      // const accounts = await web3.eth.getAccounts();
      const user = await contract.methods.User_Type_Mapping(accounts[0]).call();

      let length;
      if (user.role == 0) {
        length = await contract.methods.Farmer_Post_Counter().call();
        getFarmerPost(length);
      } else if (user.role == 1) {
        length = await contract.methods.Distributor_Post_Counter().call();
        getDistributorPost(length);
      } else if (user.role == 2) {
        length = await contract.methods.Vendor_Post_Counter().call();
        getVendorPost(length);
      } else if (user.role == 3) {
        get_Own_Product();
      }

      console.log("Farmer_Post_Array Length:", length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function getUser() {
    try {
      const { contract, web3, accounts } = state;
      // const accounts = await web3.eth.getAccounts();

      // Check if there are accounts available
      if (accounts.length === 0) {
        console.error("No Ethereum accounts available");
        return;
      }

      const user = await contract.methods.User_Type_Mapping(accounts[0]).call();
      setRole(user.role);
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Handle the error (e.g., show a message to the user)
    }
  }

  useEffect(() => {
    getUser();
    fetchFarmerPosts();

    const intervalId = setInterval(() => {
      getUser();
      fetchFarmerPosts();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [state]);
  return (
    <section className="flex flex-col justify-center items-center">
      <div className="text-5xl md:text-[75px] md:leading-snug font-bold py-10">
        MY POSTS
      </div>

      <div className="flex flex-wrap justify-center items-center gap-10 py-10">
        {!loadData ? (
          farmerPosts.map((post, index) => (
            <>
              <Card
                state={state}
                id={post.id}
                img={post.img}
                title={post.Product_name}
                desc={post.Product_description}
                owner={"Me"}
                quantity={post.Product_quantity}
                price={post.price}
                myposts={true}
                transaction_id={post.transaction_id}
                role={role}
              />
            </>
          ))
        ) : (
          <>
            <Skeletoncard />
            <Skeletoncard />
            <Skeletoncard />
          </>
        )}
      </div>
    </section>
  );
};

export default MyPost;
