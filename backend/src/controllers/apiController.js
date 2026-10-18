export const getStatus = (req, res) => {
  res.json({
    status: 'success',
    message: 'Backend Express API is running smoothly!',
    timestamp: new Date().toISOString()
  });
};
