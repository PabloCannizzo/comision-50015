const UserModel = require("../dao/models/user.model.js");

class UserRepository {
    async findByEmail(email) {
        return UserModel.findOne({ email });
    }
}

module.exports = UserRepository;