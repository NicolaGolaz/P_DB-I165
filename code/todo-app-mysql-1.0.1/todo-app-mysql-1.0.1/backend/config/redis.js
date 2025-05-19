const { createClient } = require('redis');

const redisClient = createClient({
  url: 'redis://:admin@localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
  try {
    await redisClient.connect();
    console.log('Redis client connected');
  } catch (err) {
    console.error('Redis client connection error', err);
  }
})();

module.exports = redisClient;
