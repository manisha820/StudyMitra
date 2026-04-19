import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgresql://postgres.erevwzaymsqqdjyzkolt:MitraStudy$51@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres';

const client = new Client({
  connectionString,
});

async function run() {
  try {
    await client.connect();
    console.log("Successfully connected to Supabase Postgres via pg!");
    
    // Test auth schema existence
    const res = await client.query('SELECT current_database();');
    console.log("Current Database:", res.rows[0].current_database);
    
    await client.end();
  } catch (err) {
    console.error("Connection Error:", err);
  }
}

run();
