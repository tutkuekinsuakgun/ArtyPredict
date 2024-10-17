// src/components/Header.js

import React from 'react';

function Header({ account, connectWallet }) {
  return (
    <header>
      <h1>Prediction Market</h1>
      {!account ? (
        <button onClick={connectWallet}>Cüzdanı Bağla</button>
      ) : (
        <p>Cüzdanınız: {account}</p>
      )}
    </header>
  );
}

export default Header;
