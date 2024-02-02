import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Hero from "./components/home/Hero";
import Explore from "./components/explore/Explore";
import CreatePost from "./components/register/CreatePost";
import Register from "./components/register/Register";
import Transactions from "./components/transactions/Transactions";
import MyPost from "./components/explore/MyPost";
import { useState } from "react";

function App() {

  const [state, setState] = useState({
    web3: null,
    contract: null,
  });

  const saveState = (state) => {
    console.log(state);
    setState(state);
  };

  return (
      <>
      <BrowserRouter>
      <Navbar saveState={saveState}/>
      <Routes>
        <Route path="/" element={<Hero state={state} />} />
        <Route path="/explore" element={<Explore state={state} />} />
        <Route path="/farmer_create" element={<CreatePost state={state} />} />
        <Route path="/register" element={<Register state={state} />} />
        <Route path="/mypost" element={<MyPost state={state} />} />
        <Route path="transactions">
          <Route path=":value1/:value2/:value3" element={<Transactions state={state} />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
