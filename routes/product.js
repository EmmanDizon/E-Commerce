const express = require("express");
const router = express.Router();

const {
  newProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReviews,
} = require("../controllers/product_controller");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router
  .route("/get_all_data")
  .get(getProducts);
router.route("/get_data_by_id/:id").get(getSingleProduct);

router.route("/new").post(isAuthenticatedUser, authorizeRoles(), newProduct);
router.route("/update/:id").put(isAuthenticatedUser, updateProduct);

router.route("/delete/:id").delete(isAuthenticatedUser, deleteProduct);

router.route("/product_review").post(isAuthenticatedUser, createProductReview);
router
  .route("/get_product_reviews/:id")
  .get(isAuthenticatedUser, getProductReviews);

router.route("/delete_review").delete(isAuthenticatedUser, deleteReviews);

module.exports = router;
