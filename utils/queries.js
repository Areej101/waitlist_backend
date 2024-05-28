const checkTableExists = async (client) => {
    const result = await client.sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
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

  module.exports = { 
    checkTableExists, 
    createUsersTable, 
    insertUser, 
    findUserByEmail, 
    getAllUsers,
};