const checkTableExists = async (client, tableName) => {
    const result = await client.sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = ${tableName}
      ) AS "exists"
    `;
    return result.rows[0].exists;
  };
  
  const createUsersTable = async (client) => {
    await client.sql`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        company_name VARCHAR(255),
        email VARCHAR(255),
        reason TEXT
      )
    `;
  };
  
  const insertUser = async (client, user) => {
    const { name, company_name, email, reason } = user;
    await client.sql`
      INSERT INTO users (name, company_name, email, reason) 
      VALUES (${name}, ${company_name}, ${email}, ${reason})
    `;
  };

  const findUserByEmail = async (client, email) => {
    const result = await client.sql`
      SELECT * FROM users WHERE email = ${email}
    `;
    return result.rows[0];
  };

  const getAllUsers = async (client) => {
    const result = await client.sql`
      SELECT * FROM users
    `;
    return result.rows;
  };


  const createKeyValueTable = async (client) => {
    await client.sql`
      CREATE TABLE "key-value" (
        id SERIAL PRIMARY KEY,
        key VARCHAR(255) UNIQUE,
        value BOOLEAN
      )
    `;
  };

  const findKeyValue = async (client, key) => {
    const result = await client.sql`
      SELECT * FROM "key-value" WHERE key = ${key}
    `;
    return result.rows[0];
  };
  
  const upsertKeyValue = async (client, key, value) => {
    const existingKeyValue = await findKeyValue(client, key);
  
    if (existingKeyValue) {
      await client.sql`
        UPDATE "key-value" SET value = ${value} WHERE key = ${key}
      `;
    } else {
      await client.sql`
        INSERT INTO "key-value" (key, value) VALUES (${key}, ${value})
      `;
    }
  };

  module.exports = { 
    checkTableExists, 
    createUsersTable, 
    insertUser, 
    findUserByEmail, 
    getAllUsers,
    createKeyValueTable,
    findKeyValue,
    upsertKeyValue,
};