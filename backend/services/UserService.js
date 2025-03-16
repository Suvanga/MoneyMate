import User from "../model/User.js";

class UserService {
    static async createUser(userData) {
        const newUser = new User(userData);
        return newUser.save();
    }

    static async findUserByUserName(userName) {
        return await User.findOne({ username: userName }).exec();
    }

    static async findUserById(userId) {
        return await User.findById(userId).exec();
    }

    static async findUserByEmail(email) {
        return await User.findOne({ email: email }).exec();
    }

    static async updateUser(userId, updatedData) {
        return User.findByIdAndUpdate(userId, updatedData).exec();
    }

    static async deleteUser(userId) {
        return User.deleteOne({ _id: userId }).exec();
    }
}

export default UserService;