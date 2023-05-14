import Navbar from './components/navbar/Navbar';
import './App.css'
import SignerProvider from './state/signer';
import { Route, Routes } from 'react-router-dom';
import Create from './views/Create';
import OwnedNfts from './views/OwnedNfts';


function App() {
  




  return (
    <SignerProvider>
      <Navbar />
      <Routes>
        <Route path="/create" element={<Create />}/>
        <Route path="/owned" element={<OwnedNfts />}/>
      </Routes>
    </SignerProvider>
  );
}

export default App;


