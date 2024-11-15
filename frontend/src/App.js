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
    console.log('connectWallet fonksiyonu çağrıldı');
    if (window.ethereum) {
      try {
        // MetaMask ile bağlantı isteği
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // BrowserProvider oluşturma (Ethers.js v6)
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        let network = await newProvider.getNetwork();

        // Sepolia ağı kontrolü
        if (network.chainId !== 11155111) { // Sepolia'nın chainId'si 11155111
          try {
            // Ağ değiştirme isteği
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0xaa36a7' }], // 11155111'in hexadecimal karşılığı
            });
            // Ağ değiştikten sonra network bilgisini güncelle
            network = await newProvider.getNetwork();
          } catch (switchError) {
            // Ağ eklenmemişse ekleme isteği gönderebilirsiniz
            if (switchError.code === 4902) {
              alert('Lütfen MetaMask ağınızı Sepolia olarak ayarlayın.');
            } else {
              console.error('Ağ değiştirme hatası:', switchError);
            }
            return;
          }
        }

        const signer = await newProvider.getSigner();

        // Kullanıcının adresini alma
        const address = await signer.getAddress();
        console.log('Bağlı hesap:', address);
        setAccount(address);
        setProvider(newProvider);

        // Sözleşme örneği oluşturma
        const contractAddress = '0x70e51ce1075491fAa307fDCcf03aA0d10814E81A'; // Sepolia'da dağıttığınız sözleşme adresi
        const contractABI = PredictionMarket.abi;

        const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(contractInstance);

        // Piyasa durumunu alma
        const isClosed = await contractInstance.marketClosed();
        setMarketClosed(isClosed);
      } catch (error) {
        console.error('Metamask bağlantı hatası:', error);
        if (error.code === 4001) {
          // Kullanıcı bağlantı isteğini reddetti
          alert('Bağlantı isteği reddedildi.');
        } else {
          alert('Cüzdan bağlantısı sırasında bir hata oluştu.');
        }
      }
    } else {
      alert('Lütfen MetaMask yükleyin!');
    }
  };

  useEffect(() => {
    if (window.ethereum && account == null) {
      window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
        if (accounts.length > 0) {
          connectWallet();
        }
      });
    }
  }, [account]);

  const placeBet = async (choice, amount) => {
    if (!contract) return;
    try {
      const tx = await contract.placeBet(choice, {
        value: ethers.parseEther(amount)
      });
      await tx.wait();
      alert('Bahis başarıyla yapıldı!');
    } catch (error) {
      console.error('Bahis yapma hatası:', error);
      if (error.code === 'INSUFFICIENT_FUNDS') {
        alert('Yetersiz bakiye. Lütfen hesabınızda yeterli ETH olduğundan emin olun.');
      } else {
        alert(`Bahis yapma işlemi başarısız oldu: ${error.reason || error.message}`);
      }
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
      alert(`Ödül talep etme işlemi başarısız oldu: ${error.reason || error.message}`);
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
