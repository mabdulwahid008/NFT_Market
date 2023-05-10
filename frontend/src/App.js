import react from 'react'
import Navbar from './components/navbar/Navbar';
import './App.css'
import SignerProvider from './state/signer';
import { Route, Routes } from 'react-router-dom';
import Create from './views/Create';

function App() {
  return (
    <SignerProvider>
      <Navbar />
      <Routes>
        <Route path="/create" element={<Create />}/>
      </Routes>
    </SignerProvider>
  );
}

export default App;
