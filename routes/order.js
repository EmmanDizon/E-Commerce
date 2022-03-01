const express = require("express");
const router = express.Router();

const {
  createOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrders,
  deleteOrder,
} = require("../controllers/order_controller");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.route("/new").post(isAuthenticatedUser, createOrder);
router.route("/get_data_by_id/:id").get(isAuthenticatedUser, getSingleOrder);
router.route("/my_orders").get(isAuthenticatedUser, myOrders);
router
  .route("/get_all_orders")
  .get(isAuthenticatedUser, authorizeRoles(), getAllOrders);

router.put("/process_order/:id", isAuthenticatedUser, updateOrders);

router.delete(
  "/delete_order/:id",
  isAuthenticatedUser,
  authorizeRoles(),
  deleteOrder
);
module.exports = router;
