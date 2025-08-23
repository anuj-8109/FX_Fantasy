module.exports.errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ status: false, message: 'Server Error', error: err.message });
};
