const { connectToDatabase } = require('../utils/db');
const { checkTableExists ,createKeyValueTable, findKeyValue, upsertKeyValue,} = require('../utils/queries');

/*
    Update wait list flag
    POST /api/wait-list/flag
*/
async function UpdateWaitListFlag(req, res) {
    try {
        const client = await connectToDatabase();

        // Check if the key-value table exists
        const tableExists = await checkTableExists(client, 'key-value');

        console.log(tableExists);

        // Create the key-value table if it doesn't exist
        if (!tableExists) {
            await createKeyValueTable(client);
        }

        const { key, value } = req.body;

        // Upsert the key-value pair
        await upsertKeyValue(client, key, value);

        // Return a success response
        res.json({ success: true, message: `${key} updated successfully` });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Internal Server Error', 
            error: error.message
        });
    }
}

/*
    Get wait list flag
    GET /api/wait-list/flag
*/
async function GetWaitListFlag(req, res) {
    try {
        const client = await connectToDatabase();

        const { key } = req.query;

        if (!key) {
            return res.status(400).json({ success: false, message: 'Key query parameter is required' });
        }

        // Fetch the key-value pair
        const keyValue = await findKeyValue(client, key);

        if (!keyValue) {
            return res.status(404).json({ success: false, message: 'Key not found' });
        }

        // Return the key-value pair
        res.json({ success: true, data: keyValue });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Internal Server Error', 
            error: error.message
        });
    }
}

module.exports = {
    UpdateWaitListFlag,
    GetWaitListFlag
};