import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import PredictionMarket from './abi/PredictionMarket.json';
import Header from './components/Header';
import BetForm from './components/BetForm';
import ClaimReward from './components/ClaimReward';
import MarketStatus from './components/MarketStatus';

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [marketClosed, setMarketClosed] = useState(false);
  const [provider, setProvider] = useState(null);
  const connectWallet = async () => {
    console.log('connectWallet fonksiyonu çağrıldı'); // Konsol logu eklendi
    if (window.ethereum) {
      try {
        // Metamask ile bağlantı isteği
        await window.ethereum.request({ method: 'eth_requestAccounts' });
  
        // Provider ve Signer oluşturma
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        const signer = await newProvider.getSigner();
  
        // Kullanıcının adresini alma
        const address = await signer.getAddress();
        console.log('Bağlı hesap:', address); // Konsol logu eklendi
        setAccount(address);
        setProvider(newProvider);
  
        // Sözleşme örneği oluşturma
        const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Sözleşme adresinizi buraya ekleyin
        const contractABI = PredictionMarket.abi;
  
        const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(contractInstance);
  
        // Piyasa durumunu alma
        const isClosed = await contractInstance.marketClosed();
        setMarketClosed(isClosed);
      } catch (error) {
        console.error('Metamask bağlantı hatası:', error);
      }
    } else {
      alert('Lütfen Metamask yükleyin!');
    }
  };
  

  useEffect(() => {
    // Kullanıcının zaten bağlı olup olmadığını kontrol edebiliriz
    if (window.ethereum && account == null) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            // Kullanıcı zaten bağlı
            connectWallet();
          }
        });
    }
  }, []);

  const placeBet = async (choice, amount) => {
    if (!contract) return;
    try {
      const tx = await contract.placeBet(choice, {
        value: ethers.parseEther(amount),
      });
      await tx.wait();
      alert('Bahis başarıyla yapıldı!');
    } catch (error) {
      console.error('Bahis yapma hatası:', error);
      alert('Bahis yapma işlemi başarısız oldu.');
    }
  };

  const claimReward = async () => {
    if (!contract) return;
    try {
      const tx = await contract.claimReward();
      await tx.wait();
      alert('Ödül başarıyla talep edildi!');
    } catch (error) {
      console.error('Ödül talep etme hatası:', error);
      alert('Ödül talep etme işlemi başarısız oldu.');
    }
  };

  return (
    <div>
      <Header account={account} connectWallet={connectWallet} />
      {account && (
        <>
          <p>Cüzdanınız: {account}</p>
          <MarketStatus marketClosed={marketClosed} />
          {!marketClosed ? (
            <BetForm placeBet={placeBet} />
          ) : (
            <ClaimReward claimReward={claimReward} />
          )}
        </>
      )}
    </div>
  );
}

export default App;
