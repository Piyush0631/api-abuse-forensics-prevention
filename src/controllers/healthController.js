const healthCheck = (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "api-abuse-forensics-prevention",
    time: new Date().toISOString(),
  });
};

const protectedHealthCheck = (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Protected route access granted",
    user: req.user,
  });
};

module.exports = {
  healthCheck,
  protectedHealthCheck,
};
