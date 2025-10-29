// json-server middleware to simulate API delay for POST requests
module.exports = (req, res, next) => {
  // Add 3 second delay only for POST requests
  if (req.method === 'POST') {
    setTimeout(() => {
      next();
    }, 3000);
  } else {
    // No delay for other requests
    next();
  }
};