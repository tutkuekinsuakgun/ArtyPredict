import React, { useState } from 'react';

function BetForm({ placeBet }) {
  const [amount, setAmount] = useState('');
  const [choice, setChoice] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    placeBet(choice, amount);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Miktar (ETH):
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </label>
      <label>
        Seçim:
        <select value={choice} onChange={(e) => setChoice(e.target.value === 'true')}>
          <option value="true">Evet</option>
          <option value="false">Hayır</option>
        </select>
      </label>
      <button type="submit">Bahis Yap</button>
    </form>
  );
}

export default BetForm;
