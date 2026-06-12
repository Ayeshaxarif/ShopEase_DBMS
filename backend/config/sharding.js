const SHARDS = {
  shard_0: {
    id: 'shard_0',
    name: 'Shard 0 — Electronics & Fashion / Even Users',
    description: 'Handles Electronics, Fashion products + even-hash user orders',
  },
  shard_1: {
    id: 'shard_1',
    name: 'Shard 1 — Home & Sports / Odd Users',
    description: 'Handles Home, Sports products + odd-hash user orders',
  },
};

const PRODUCT_SHARD_MAP = {
  Electronics: 'shard_0',
  Fashion:     'shard_0',
  Home:        'shard_1',
  Sports:      'shard_1',
};

const getProductShard = (category) => {
  const shardId = PRODUCT_SHARD_MAP[category];
  if (!shardId) {
    console.warn(`⚠️  [SHARD] Unknown category "${category}", defaulting to shard_0`);
    return 'shard_0';
  }
  console.log(`🔀 [SHARD] Product (${category}) → ${shardId}`);
  return shardId;
};

const getProductShardsByCategories = (categories) => {
  if (!categories || categories === 'All' || categories.length === 0) {
    console.log('🔀 [SHARD] All-category query → scatter-gather across [shard_0, shard_1]');
    return Object.keys(SHARDS);
  }
  const cats = Array.isArray(categories) ? categories : [categories];
  const shards = [...new Set(cats.map((c) => getProductShard(c)))];
  console.log(`🔀 [SHARD] Categories [${cats.join(', ')}] → shards [${shards.join(', ')}]`);
  return shards;
};

const simpleHash = (str) => {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash);
};

const getOrderShard = (userId) => {
  if (!userId) {
    console.log('🔀 [SHARD] Guest order (no userId) → shard_0');
    return 'shard_0';
  }
  const hash = simpleHash(userId.toString());
  const shardIndex = hash % Object.keys(SHARDS).length;
  const shardId = `shard_${shardIndex}`;
  console.log(`🔀 [SHARD] Order (userId: ${userId.toString().slice(-6)}...) hash=${hash} → ${shardId}`);
  return shardId;
};

const getShardingInfo = () => ({
  strategy: {
    products: 'Range-Based Sharding on `category` field',
    orders:   'Hash-Based Sharding on `userId` field',
  },
  shards: Object.values(SHARDS).map((s) => ({
    id:          s.id,
    name:        s.name,
    description: s.description,
  })),
  productShardMap: PRODUCT_SHARD_MAP,
  totalShards: Object.keys(SHARDS).length,
  note: 'In production, each shard would be a separate MongoDB replica set. '
      + 'This demo runs on a single instance but routes queries using shard logic.',
});

module.exports = {
  SHARDS,
  PRODUCT_SHARD_MAP,
  getProductShard,
  getProductShardsByCategories,
  getOrderShard,
  simpleHash,
  getShardingInfo,
};