const Products = require("../models/products");
const ErrorHandler = require("../utils/error_handler");
const catchAsyncErrors = require("../middlewares/catch_async_errors");
const SearchQuery = require("../utils/search_query");

exports.newProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.createdBy = req.user.id;

  const products = await Products.create(req.body);
  res.status(201).json({
    success: true,
    message: products,
  });
});

exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = 4;
  const productsCount = await Products.countDocuments();
  const search = new SearchQuery(Products.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage);
  const products = await search.query;

  res.status(200).json({
    success: true,
    productsCount,
    products,
    resPerPage,
  });
});

exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Products.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found.", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Products.findById(req.params.id);
  let result = {};

  if (!product) {
    return next(new ErrorHandler("Product not found.", 404));
  }

  product = await Products.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: product,
  });
});

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Products.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found.", 404));
  }

  await product.remove();
  res.status(200).json({
    success: true,
    message: "Product deleted",
  });
});

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    userId: req.user.id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Products.findById(productId);
  const isReviewed = product.reviews.find(
    (r) => r.userId.toString() === req.user.id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review.userId.toString() === req.user.id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  product.ratings = product.reviews.reduce((initialValue, currentValue) => {
    return initialValue + currentValue.rating / product.reviews.length;
  }, 0);

  await product.save({ validateBeforeSave: false });

  res.json({
    success: true,
  });
});

exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Products.findById(req.params.id);

  if (!product) return next(new ErrorHandler("No products found.", 404));

  res.json({
    success: true,
    message: product.reviews,
  });
});

exports.deleteReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Products.findById(req.query.productid);

  if (!product) return next(new ErrorHandler("No products found.", 404));

  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== req.query.id.toString()
  );

  const numOfReviews = reviews.length;

  const ratings = product.reviews.reduce((initialValue, currentValue) => {
    return initialValue + currentValue.rating / product.reviews.length;
  }, 0);

  await Products.findByIdAndUpdate(
    req.query.productid,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    { new: true }
  );
  res.json({
    success: true,
  });
});
