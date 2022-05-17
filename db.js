const { Pool } = require('pg');

const db_config = {
    max : 200, // max number of clients in the pool
    connectionTimeoutMillis : 2000,
    idleTimeoutMillis : 10000,
    allowExitOnIdle:true,
    user: 'novigo',
    host: '35.193.33.226',
    database: 'students',
    password: 'Novigo@123',
    port: '5432'
}




let pool = new Pool(db_config);

async function DatabaseService() {
    const client = await pool.connect()
    return {
        query: async function (sql) {
            let result = await client.query(sql);
            return result;
        },
        close : async function close() {
           try {
            await client.release();
           } catch (error) {
               console.error(error);
           }
        }
    } 
}

module.exports = DatabaseService;