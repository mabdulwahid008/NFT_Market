import Navbar from './components/navbar/Navbar';
import './App.css'
import SignerProvider from './state/signer';
import { Route, Routes } from 'react-router-dom';
import Create from './views/Create';
import OwnedNfts from './views/OwnedNfts';
import ViewNft from './views/ViewNft';
import BuyNFTs from './views/BuyNFTs';


function App() {
  


  return (
    <SignerProvider>
      <Navbar />
      <Routes>
        <Route path="/create" element={<Create />}/>
        <Route path="/owned" element={<OwnedNfts />}/>
        <Route path="/buy" element={<BuyNFTs />}/>
        <Route path="/nft/view/:id" element={<ViewNft />}/>
      </Routes>
    </SignerProvider>
  );
}

export default App;


