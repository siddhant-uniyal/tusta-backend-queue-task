import { createClient } from 'redis';

const client = createClient()

client.on('error', e => console.log('Redis Client Error', e.message));

await client.connect();

export default client
