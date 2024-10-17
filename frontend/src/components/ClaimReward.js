import React from 'react';

function ClaimReward({ claimReward }) {
  return (
    <div>
      <button onClick={claimReward}>Ödülünü Talep Et</button>
    </div>
  );
}

export default ClaimReward;
