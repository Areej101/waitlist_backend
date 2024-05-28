const { connectToDatabase } = require('../utils/db');
const { checkTableExists, createUsersTable, insertUser, findUserByEmail, getAllUsers } = require('../utils/queries');

/*
    Register a new user
    POST /api/wait-list/register
*/
async function RegisterUser(req, res) {

    try {
        const client = await connectToDatabase();

        // Check if the users table exists
        const tableExists = await checkTableExists(client, 'users');

        // Create the users table if it doesn't exist
        if (!tableExists) {
            await createUsersTable(client);
        }

        const { email } = req.body;

        // Check if a user with the same email already exists
        const existingUser = await findUserByEmail(client, email);

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists with this email' });
        }
    
        // Insert the new user
        await insertUser(client, req.body);
    
        // Return a success response
        res.json({ success: true, message: 'User inserted successfully' });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Internal Server Error', 
            error: error.message
        });
    }

    
};

/*
    Get all users
    GET /api/wait-list/users
*/
async function GetUsers(req, res) {
    try{
        const client = await connectToDatabase();

        // Fetch all users
        const users = await getAllUsers(client);

        // Return the list of users
        res.json({ success: true, data: users });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Internal Server Error', 
            error: error.message
        });
    }
}

module.exports = { RegisterUser, GetUsers };
