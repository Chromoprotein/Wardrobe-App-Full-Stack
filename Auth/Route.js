const express = require("express")
const router = express.Router()
// Import the user authentication functions from Auth
const { userAuth } = require("../middleware/auth")
const { register, login, logout, userStatus } = require("./Auth")

// The route and the method and function that follow
router.route("/register").post(register)
router.route("/login").post(login)
router.route("/userStatus").get(userStatus)
// Only for users
router.route("/logout").post(userAuth, logout)

module.exports = router