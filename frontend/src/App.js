import Navbar from './components/navbar/Navbar';
import './App.css'
import { Route, Routes } from 'react-router-dom';
import Create from './views/Create';
import OwnedNfts from './views/OwnedNfts';
import ViewOwnedNft from './views/ViewOwnedNft';
import BuyNFTs from './views/BuyNFTs';
import Footer from './components/footer/Footer';
import ViewListedNFT from './views/ViewListedNFT';
import { useContext, useEffect } from 'react';
import { SignerContext } from './state/signer';
import Home from './views/Home';


function App() {
  const {refreash} = useContext(SignerContext)
  useEffect(()=>{
  }, [refreash])
  return (
    <>
      <div className='mobile'>
          <p>Please open it on Laptop</p>
      </div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/create" element={<Create />}/>
        <Route path="/owned" element={<OwnedNfts />}/>
        <Route path="/buy" element={<BuyNFTs />}/>
        <Route path="/nft/view/:id" element={<ViewOwnedNft />}/>
        <Route path="/nft/buy/:id" element={<ViewListedNFT />}/>
      </Routes>
      {/* <Footer /> */}
    </>
  );
}

export default App;


