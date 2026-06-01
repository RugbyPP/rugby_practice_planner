import { Client } from 'pg';

let client: Client | null = null;

export async function getClient(): Promise<Client> {
  if (client) {
    return client;
  }

  const connectionString = process.env.POSTGRES_URL_NON_POOLING;
  if (!connectionString) {
    throw new Error('POSTGRES_URL_NON_POOLING not set');
  }

  client = new Client({
    connectionString,
    statement_timeout: 5000,
    query_timeout: 5000,
  });

  try {
    await Promise.race([
      client.connect(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout')), 5000)
      ),
    ]);
  } catch (err) {
    client = null;
    throw err;
  }

  return client;
}

export async function query(text: string, values?: any[]) {
  const c = await getClient();
  try {
    return await Promise.race([
      c.query(text, values),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Query timeout')), 5000)
      ),
    ]);
  } catch (err) {
    client = null;
    throw err;
  }
}
