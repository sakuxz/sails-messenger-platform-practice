/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: async (req, res) => {
		let newUser = await User.create({
			email: "123@456",
			password: '789'
		})
		res.ok({
			data: newUser
		})
	}
};
