import React from 'react';
import './ShardBadge.css';

function ShardBadge({ sharding }) {
  if (!sharding) return null;

  const { shardsQueried, queryType, shardKey } = sharding;

  return (
    <div className="shard-badge-container">
      <span className={`shard-badge ${queryType === 'targeted' ? 'targeted' : 'scatter'}`}>
        🔀 {queryType === 'targeted' ? 'Targeted Query' : 'Scatter-Gather'}
      </span>
      <span className="shard-info-text">
        Shard Key: <strong>{shardKey}</strong> → [{shardsQueried.join(', ')}]
      </span>
    </div>
  );
}

export default ShardBadge;