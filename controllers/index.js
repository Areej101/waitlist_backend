
// wait list registration controller
const { RegisterUser, GetUsers } = require('./waitListform.controller');
const { UpdateWaitListFlag, GetWaitListFlag } = require('./waitListFlag.controller');


// export all the controllers
module.exports = {
    RegisterUser, 
    GetUsers,
    UpdateWaitListFlag,
    GetWaitListFlag
};