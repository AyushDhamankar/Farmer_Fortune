import { useState, useEffect } from "react";
import left from "../../assets/svg/left.svg";
import tomato from "../../assets/common/tomato.webp";
import { useParams } from "react-router-dom";
import moment from "moment";
import { useNavigate } from 'react-router-dom';

const Transactions = ({ state }) => {
  const navigate = useNavigate();
  const { value1, value2, value3 } = useParams();
  console.log("Hippo : ", value1, value2, typeof value3);
  const { contract } = state;
  const [name, setName] = useState("");
  const [Detail, setDetail] = useState("");
  const [Transaction, SetTransaction] = useState([]);

  function shortenEthereumAddress(address) {
    const prefix = address.substring(0, 4);
    const suffix = address.substring(address.length - 2);
    return `${prefix}...${suffix}`;
  }

  function timeConvertor(time) {
    const timestampInMilliseconds = time * 1000;
    const formattedDate = moment(timestampInMilliseconds).format(
      "Do MMMM YYYY"
    );
    return formattedDate;
  }

  async function getFarmerDetail() {
    try {
      const nameText = await contract.methods
        .Farmer_Post_Array(value1)
        .call();
      const projects = await contract.methods
        .getFarmerTransactions(value1)
        .call();
      nameText.price = nameText.Farmer_price;
      console.log(nameText);
      setPrice(nameText.Farmer_price);
      setDetail(nameText);
      SetTransaction(projects);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function getDistributorDetail() {
    try {
      const nameText = await contract.methods
        .Distributor_Post_Array(value1)
        .call();
      const projects = await contract.methods
        .getFarmerTransactions(nameText.transactions_id)
        .call();
      nameText.price = nameText.Distributor_price;
      console.log(nameText);
      setPrice(nameText.Distributor_price);
      setDetail(nameText);
      SetTransaction(projects);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function getVendorDetail() {
    try {
      const nameText = await contract.methods
        .Vendor_Post_Array(value1)
        .call();
      const projects = await contract.methods
        .getFarmerTransactions(nameText.transactions_id)
        .call();
      nameText.price = nameText.Vendor_price;
      console.log(nameText);
      setPrice(nameText.Vendor_price);
      setDetail(nameText);
      SetTransaction(projects);
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
      setName(user.name);
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Handle the error (e.g., show a message to the user)
    }
  }

  useEffect(() => {
    if (!contract || !value1 || !value2 || !value3) {
      return; // Exit if contract or value1 is not available
    }
    getUser();
    if (value2 == 1 && value3 == "false") {
      getFarmerDetail();
    } else if (value2 == 2 && value3 == "false") {
      getDistributorDetail();
    } else if (value2 == 3 && value3 == "false") {
      getVendorDetail();
    } else if(value2 == 0 && value3 == "true") {
      getFarmerDetail();
    } else if(value2 == 1 && value3 == "true") {
      getDistributorDetail();
    } else if(value2 == 2 && value3 == "true") {
      getVendorDetail();
    } else if(value2 == 3 && value3 == "true") {
      getVendorDetail();
    }

    // Setup interval to run fetchData every, for example, 5 seconds
    const intervalId = setInterval(() => {
      fetchData();
    }, 1000); // 1000 milliseconds = 1 seconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [contract, value1, value2, value3]);

  //
  // State to handle whether the price is editable or not
  const [isEditing, setIsEditing] = useState(false);

  // State to handle the current price
  const [price, setPrice] = useState(0.55); // Assuming the initial price is 0.55 ETH

  // Handle the editing state
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Handle price change
  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };

  // Handle saving the new price
  const handleSaveClick = async() => {
    setIsEditing(false);
    const { contract, web3, accounts } = state;
    // const accounts = await web3.eth.getAccounts();
    console.log(accounts[0]);
    console.log(value1, price);
    if(value2 == 1 && value3 == "false") {
      await contract.methods
        .Distributor_Post_Create(value1, price)
        .send({ from: accounts[0] });
    } else if(value2 == 2 && value3 == "false") {
      await contract.methods
        .Vendor_Post_Create(value1, price)
        .send({ from: accounts[0] });
    }
    navigate('/farmer_create');
    // Here, you would also handle saving the new price to the database or backend
  };
  //

  return (
    <>
      <section className="flex flex-col justify-center items-center">
        <div className="text-5xl text-center md:text-[75px] md:leading-snug font-bold py-10">
          PRODUCT DETAILS
        </div>
        <div className="flex md:flex-row flex-col gap-20 justify-center w-full px-6 md:px-20 py-10">
          <div className="md:w-1/2">
            <img
              src={Detail.img ? Detail.img : tomato}
              alt=""
              className="h-full w-full object-cover rounded-lg"
            />
          </div>
          <div className="md:w-1/2 flex-col flex gap-2 md:gap-4 justify-center max-md:items-center">
            <h1 className="text-5xl font-bold text-black">{Detail.Product_name}</h1>
            <p className="w-[80%] text-black max-md:text-center">
              {Detail.Product_description}
            </p>
            <p className="text-black font-bold text-2xl">
              <span>Quantity </span>
              <span>{Detail.Product_quantity}</span>
            </p>
            <p className="text-black font-bold text-2xl">
              <span>By { name } {value2 == 0 ? "(Farmer)" : value2 == 1 ? "(Distributor)" : value2 == 2 ? "(Vendor)" : "(Customer)"} </span>
            </p>

            {isEditing ? (
              <p className="text-black flex items-center justify-center w-1/2 md:w-fit font-bold text-2xl pb-10">
                <span className="pr-2 md:pr-4">Price </span>
                <input
                  type="number"
                  value={price}
                  onChange={handlePriceChange}
                  autoFocus
                  className="outline-1 py-2 w-full rounded-md remove-arrow"
                />
              </p>
            ) : (
              <p className="text-black font-bold py-2 text-2xl pb-10">
                <span>Price </span>
                <span className="">{price != 0.55 ? price : Detail.price } ETH</span>
              </p>
            )}
            {isEditing ? (
              <button
                onClick={handleSaveClick}
                className={`px-8 py-4 bg-green rounded-lg text-white font-bold text-xl ${
                  value2 == 0 || value3 == "true" ? "hidden" : "block"
                }`}
              >
                Save
              </button>
            ) : (
              <button
                onClick={handleEditClick}
                className={`px-8 py-4 bg-green rounded-lg text-white font-bold text-xl ${
                  value2 == 0 || value3 == "true" ? "hidden" : "block"
                }`}
              >
                Edit & Sell
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="flex flex-col justify-center items-center">
        <div className="text-5xl md:text-[75px] md:leading-snug font-bold py-10 uppercase">
          Transactions
        </div>

        <div className="md:px-20 px-6 justify-center flex max-md:flex-col flex-wrap md:gap-x-12 md:gap-y-20 gap-10 w-full h-full py-20">
          {Transaction.map((post, index) => (
            <>
              <TransactionsCard
                date={timeConvertor(post.time)}
                amount={post.value}
                from={post.from_name}
                to={post.to_name}
              />
            </>
          ))}
        </div>
      </section>
    </>
  );
};

export default Transactions;

const TransactionsCard = ({ date, amount, from, to }) => {
  return (
    <div className="md:w-[40%] bg-white shadow-xl rounded-lg h-full">
      <div className="px-6 flex justify-end w-full font-semibold">
        on {date}
      </div>
      <div className="px-6 py-6">
        <p>Total Amount</p>
        <p className="font-bold text-5xl">{amount} ETH</p>
      </div>
      <div className="flex px-6 py-4 items-center bg-[#E4FFDA5C] justify-between">
        <p className="font-semibold">
          <span className="font-normal text-[#00000085]">from </span> {from}
        </p>
        <p>
          <img src={left} alt="" />
        </p>
        <p className="font-semibold">
          <span className="font-normal text-[#00000085]">to </span> {to}
        </p>
      </div>
    </div>
  );
};
