import react from 'react'
import Navbar from './components/navbar/Navbar';
import './App.css'
import SignerProvider from './state/signer';

function App() {
  return (
    <SignerProvider>
      <Navbar />
    </SignerProvider>
  );
}

export default App;
