const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPasswordUrl,
  userProfile,
  changePassword,
  updateUserProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/auth_controller");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.route("/get_profile").get(isAuthenticatedUser, userProfile);
router.route("/update_profile").put(isAuthenticatedUser, updateUserProfile);

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/forgot_password").post(forgotPassword);

router.route("/reset_password/:token").put(resetPasswordUrl);
router.route("/change_password").put(isAuthenticatedUser, changePassword);
router.route("/update_profile").put(isAuthenticatedUser, updateUserProfile);

//admin section
router
  .route("/get_all_users")
  .get(isAuthenticatedUser, authorizeRoles(), getAllUsers);
router
  .route("/get_user_by_id/:id")
  .get(isAuthenticatedUser, authorizeRoles(), getUserById);

router
  .route("/update_user_profile/:id")
  .put(isAuthenticatedUser, authorizeRoles(), updateUser);

router
  .route("/delete_user/:id")
  .delete(isAuthenticatedUser, authorizeRoles(), deleteUser);

module.exports = router;
