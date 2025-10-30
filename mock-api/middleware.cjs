// json-server middleware to simulate API delay for POST requests
// and track progress with console output
module.exports = (req, res, next) => {
  if (req.method === 'POST') {
    // Log progress based on the endpoint
    if (req.path === '/basicInfo') {
      console.log('⏳ Submitting basicInfo...');
      setTimeout(() => {
        console.log('✅ basicInfo saved!');
        next();
      }, 3000);
    } else if (req.path === '/details') {
      console.log('⏳ Submitting details...');
      setTimeout(() => {
        console.log('✅ details saved!');
        console.log('🎉 All data processed successfully!');
        next();
      }, 3000);
    } else {
      // Other POST requests
      setTimeout(() => {
        next();
      }, 3000);
    }
  } else {
    // No delay for other requests
    next();
  }
};