import React, { useState } from "react";
// import PostProduct from "../../assets/banner/post-product.webp";
import PostProduct from "../../assets/common/fotor-ai-2023112116513 1.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../Loading/Loading";

const Register = ({ state }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationChange = (event) => {
    setRole(event.target.value);
  };

  const register = async (event) => {
    try {
      event.preventDefault();
      setIsLoading(true);
      let Role;
      if (role == "farmer") {
        Role = 0;
      } else if (role == "distributor") {
        Role = 1;
      } else if (role == "vendor") {
        Role = 2;
      } else if (role == "customer") {
        Role = 3;
      }
      if (
        name !== "" &&
        email !== "" &&
        (Role === 0 || Role === 1 || Role === 2 || Role === 3)
      ) {
        setIsLoading(true);
        const { contract, web3, accounts } = state;
        // const accounts = await web3.eth.getAccounts();
        console.log(accounts[0]);
        console.log(name, email, Role);
        await contract.methods
          .Register_User_Type(name, email, Role)
          .send({ from: accounts[0] });
        toast.success(`Your are now registered as ${role}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setEmail('');
        setName('');
        setRole('');
        console.log("Hii");
        setIsLoading(false);
      } else {
        toast.error("Check all field must need to be fill.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setIsLoading(false);
        console.log("Byee");
      }
    } catch (error) {
      if (error.code == 4001) {
        toast.error("User denied transaction.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {/* {isLoading && <Loading />} */}
      <ToastContainer />
      <section className="flex flex-col justify-center items-center">
        <div className="text-5xl md:text-[75px] md:leading-snug font-bold py-10 uppercase">
          Post Product
        </div>
        <div className="md:px-20 px-6 flex flex-col md:flex-row justify-center gap-10 w-full h-full py-10">
          <div className="md:w-[50%] flex flex-col gap-10">
            <div className="md:text-xl max-md:text-center">
              This provide transparent, tamper-resistant, and automated
              execution of predefined agreements. tamper-resistant, and
              automated tamper-resistant, and automated.
            </div>
            <form className="flex flex-col md:gap-6 gap-4">
              <select
                value={role}
                onChange={handleLocationChange}
                className="w-full border rounded-xl  py-4 px-4 outline-none"
              >
                <option value="">Select a Role</option>
                <option value="farmer">Farmer</option>
                <option value="distributor">Distributor</option>
                <option value="vendor">Vendor</option>
                <option value="customer">Customer</option>
              </select>
              <input
                type="text"
                name=""
                id=""
                placeholder="Name"
                className="w-full border rounded-xl  py-4 px-4 outline-none"
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                name=""
                id=""
                placeholder="Email"
                className="w-full border rounded-xl  py-4 px-4 outline-none"
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className="w-full flex items-center justify-center h-fit border rounded-xl  py-4 px-4 bg-black font-bold text-white"
                type="submit"
                onClick={register}
              >
                {isLoading ? <div className="loader h-full" /> : "Submit Now"}
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
      </section>
    </>
  );
};

export default Register;
