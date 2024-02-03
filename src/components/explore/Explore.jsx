import React from "react";
import Card from "../common/Card";
import Search from "../../assets/svg/search-icon.svg";
import { useState, useEffect } from "react";

const Explore = ({ state }) => {
  const [name, setName] = useState("");
  const [farmerPosts, setFarmerPosts] = useState([]);
  const [farmerPosts1, setFarmerPosts1] = useState([]);
  const [role, setRole] = useState();

  //
  // Function to get a specific Farmer_Post from Farmer_Post_Array
  async function getFarmerPost(index) {
    try {
      const { contract } = state;
      const farmerPost = await contract.methods.Farmer_Post_Array(index).call();
      const username = await contract.methods
        .User_Type_Mapping(farmerPost.Farmer_address)
        .call();
      farmerPost.id = farmerPost.Farmer_Post_id;
      farmerPost.name = username.name;
      farmerPost.price = farmerPost.Farmer_price;
      return farmerPost;
    } catch (error) {
      console.error("Error getting Farmer_Post:", error);
      throw error;
    }
  }

  async function getDistributorPost(index) {
    try {
      const { contract } = state;
      const farmerPost = await contract.methods
        .Distributor_Post_Array(index)
        .call();
      const username = await contract.methods
        .User_Type_Mapping(farmerPost.Distributor_address)
        .call();
      farmerPost.id = farmerPost.Distributor_Post_id;
      farmerPost.name = username.name;
      farmerPost.price = farmerPost.Distributor_price;
      return farmerPost;
    } catch (error) {
      console.error("Error getting Farmer_Post:", error);
      throw error;
    }
  }

  async function getVendorPost(index) {
    try {
      const { contract } = state;
      const farmerPost = await contract.methods.Vendor_Post_Array(index).call();
      const username = await contract.methods
        .User_Type_Mapping(farmerPost.Vendor_address)
        .call();
      farmerPost.id = farmerPost.Vendor_Post_id;
      farmerPost.name = username.name;
      farmerPost.price = farmerPost.Vendor_price;
      return farmerPost;
    } catch (error) {
      console.error("Error getting Farmer_Post:", error);
      throw error;
    }
  }

  // Example usage
  async function fetchData() {
    try {
      const { contract, web3, accounts } = state;
      // const accounts = await web3.eth.getAccounts();
      const user = await contract.methods.User_Type_Mapping(accounts[0]).call();
      let length;
      if (user.role == 1 || user.role == 0) {
        setRole(1);
        length = await contract.methods.Farmer_Post_Counter().call();
      } else if (user.role == 2) {
        setRole(2);
        length = await contract.methods.Distributor_Post_Counter().call();
      } else if (user.role == 3) {
        setRole(3);
        length = await contract.methods.Vendor_Post_Counter().call();
      }

      const posts = [];
      for (let i = 0; i < length; i++) {
        let farmerPost;
        if (user.role == 1 || user.role == 0) {
          farmerPost = await getFarmerPost(i);
        } else if (user.role == 2) {
          farmerPost = await getDistributorPost(i);
        } else if (user.role == 3) {
          farmerPost = await getVendorPost(i);
        }
        console.log(`Farmer_Post[${i}]:`, farmerPost);
        if (farmerPost.status == 0) {
          posts.push(farmerPost);
        }
      }
      setFarmerPosts(posts);
      setFarmerPosts1(posts);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  //

  async function fetchProduct(name) {
    if (name != "") {
      const filteredPosts = farmerPosts1.filter(
        (post) =>
          post.Product_name.toLowerCase().includes(name.toLowerCase()) ||
          post.name.toLowerCase().includes(name.toLowerCase())
      );
      setFarmerPosts(filteredPosts);
    } else {
      const filteredPosts = farmerPosts1;
      setFarmerPosts(filteredPosts);
    }
  }

  useEffect(() => {
    fetchData();

    // Setup interval to run fetchData every, for example, 5 seconds
    const intervalId = setInterval(() => {
      fetchData();
    }, 1000); // 1000 milliseconds = 1 seconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [state]);
  return (
    <section className="flex flex-col justify-center items-center">
      <div className="text-5xl md:text-[75px] md:leading-snug font-bold py-10">
        EXPLORE
      </div>

      <div className="w-full flex justify-center items-center gap-2 md:gap-6 px-6">
        <input
          type="text"
          name=""
          id=""
          placeholder="Search here..."
          className="md:w-2/5 w-[80%] px-4 md:px-8 py-3.5 rounded-lg text-sm focus:bg-[#656565] hover:bg-[#656565] duration-300 hover:text-white bg-bg-gray outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {/* <input type="text" name="" id="" placeholder="Search by Vegetable" className="md:w-1/4 w-full px-8 py-3.5 rounded-lg text-sm bg-bg-gray outline-none" /> */}
        <button
          onClick={(e) => {
            fetchProduct(name);
          }}
        >
          <img
            src={Search}
            alt=""
            className="px-4 py-3.5 rounded-lg hover:bg-[#656565] duration-300 bg-bg-gray"
          />
        </button>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-10 py-10">
        {farmerPosts.map((post, index) => (
          <>
            <Card
              state={state}
              id={post.id}
              img={post.img}
              title={post.Product_name}
              desc={post.Product_description}
              owner={post.name}
              quantity={post.Product_quantity}
              price={post.price}
              role={role}
            />
          </>
        ))}
      </div>
    </section>
  );
};

export default Explore;
