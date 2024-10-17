import React from 'react';

function MarketStatus({ marketClosed }) {
  return (
    <div>
      <p>Piyasa Durumu: {marketClosed ? 'Kapalı' : 'Açık'}</p>
    </div>
  );
}

export default MarketStatus;
