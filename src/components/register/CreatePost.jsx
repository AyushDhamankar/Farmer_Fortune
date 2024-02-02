import React, { useState, useEffect } from "react";
import PostProduct from "../../assets/banner/post-product.webp";
import Card from "../common/Card";
import Loading from "../Loading/Loading";

const CreatePost = ({ state }) => {
  const [img, setImg] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submitImage = async (event) => {
    try {
      event.preventDefault();
      const data = new FormData();
      data.append("file", img);
      data.append("upload_preset", "event_nft");
      data.append("cloud_name", "darrqmepw");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/darrqmepw/image/upload",
        {
          method: "post",
          body: data,
        }
      );

      const imageData = await response.json();
      console.log(imageData);
      console.log(imageData.secure_url);
      setImg(imageData.secure_url);

      return imageData.secure_url; // Return the secure URL
    } catch (error) {
      console.error(error);
      throw error; // Rethrow the error
    }
  };

  const block = async (imageUrl) => {
    try {
      setIsLoading(true);
      const { contract, alchemyweb3, web3, accounts } = state;
      // const accounts = await web3.eth.getAccounts();
      console.log(accounts[0]);
      console.log(imageUrl, name, description, quantity, price);
      await contract.methods
        .Farmer_Post_Create(imageUrl, name, description, quantity, price)
        .send({ from: accounts[0] });
      console.log("Hiii1");
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      throw error; // Rethrow the error
    }
  };

  const submitAndBlock = async (event) => {
    try {
      const imageUrl = await submitImage(event);
      await block(imageUrl);
    } catch (error) {
      console.error(error);
    }
  };

  //
  const [farmerPosts, setFarmerPosts] = useState([]);
  const [role, setRole] = useState("");

  async function getFarmerPostData(indices) {
    try {
      const { contract } = state;
      // Array to store results
      const results = [];

      for (let i = 0; i < indices.length; i++) {
        const result = await contract.methods
          .Farmer_Post_Array(indices[i])
          .call();
        result.id = result.Farmer_Post_id;
        result.price = result.Farmer_price;
        results.push(result);
      }
      setFarmerPosts(results);
      console.log("Farmer Post Data:", results);
    } catch (error) {
      console.error("Error calling Farmer_Post_Array:", error);
    }
  }

  async function getDistributorPostData(indices) {
    try {
      const { contract } = state;
      // Array to store results
      const results = [];

      for (let i = 0; i < indices.length; i++) {
        const result = await contract.methods
          .Vendor_Post_Array(indices[i])
          .call();
        result.id = result.Vendor_Post_id;
        result.price = result.Vendor_price;
        results.push(result);
      }
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
      const user = await contract.methods.User_Type_Mapping(accounts[0]).call();
      console.log(accounts);
      let distributor;
      console.log(user.role);
      if (user.role == 1) {
        distributor = await contract.methods
          .get_Owned_Properties(accounts[0], 0)
          .call();
        await getFarmerPostData(distributor);
      } else if (user.role == 2) {
        distributor = await contract.methods
          .get_Owned_Properties(accounts[0], 1)
          .call();
        await getDistributorPostData(distributor);
      }
      console.log("Hiii", distributor);
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async () => {
    try {
      const { contract, web3, accounts } = state;
      // const accounts = await web3.eth.getAccounts();
      // const accounts = await window.ethereum.request({
      //   method: "eth_requestAccounts",
      // });
      const user = await contract.methods.User_Type_Mapping(accounts[0]).call();
      setRole(user.role);
      console.log(user.role);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUser();
    get_Own_Product();
    console.log("Hii");
  }, [state]);
  //

  return (
    <>
    {isLoading && <Loading />}
    <section className="flex flex-col justify-center items-center">
      <div className="text-5xl md:text-[75px] md:leading-snug font-bold py-10 uppercase">
        Post Product
      </div>
      {role == 0 ? (
        <>
          <div className="md:px-20 px-6 flex flex-col md:flex-row justify-center gap-10 w-full h-full py-10">
            <div className="md:w-[50%] flex flex-col gap-10">
              <div className="md:text-xl max-md:text-center">
                This provide transparent, tamper-resistant, and automated
                execution of predefined agreements. tamper-resistant, and
                automated tamper-resistant, and automated.
              </div>
              <form className="flex flex-col md:gap-6 gap-4">
                <input
                  type="file"
                  name=""
                  id=""
                  placeholder="Image"
                  className="w-full border rounded-xl  py-4 px-4 outline-none"
                  onChange={(e) => setImg(e.target.files[0])}
                />
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Name"
                  className="w-full border rounded-xl  py-4 px-4 outline-none"
                  onChange={(e) => setName(e.target.value)}
                />
                <textarea
                  name=""
                  id=""
                  cols="30"
                  rows="10"
                  placeholder="Description"
                  className="resize-none w-full border rounded-xl  py-4 px-4 outline-none"
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Quantity"
                  className="w-full border rounded-xl  py-4 px-4 outline-none"
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Price"
                  className="w-full border rounded-xl  py-4 px-4 outline-none"
                  onChange={(e) => setPrice(e.target.value)}
                />
                <button
                  className="w-full border rounded-xl  py-4 px-4 bg-black font-bold text-white"
                  type="submit"
                  onClick={submitAndBlock}
                >
                  Submit Now
                </button>
              </form>
            </div>
            <div className="w-[40%] h-full max-md:hidden">
              <img
                src={PostProduct}
                alt=""
                className="h-full w-full rounded-lg"
              />
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-wrap justify-center items-center gap-10 py-10">
          {farmerPosts.length != 0 ? (
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
                  role={role}
                  create_post={true}
                  quantity_display={true}
                />
              </>
            ))
          ) : (
            <div className="text-5xl md:text-[75px] md:leading-snug font-bold py-10 uppercase">
              No Product is Purchased
            </div>
          )}
        </div>
      )}
    </section>
    </>
  );
};

export default CreatePost;
