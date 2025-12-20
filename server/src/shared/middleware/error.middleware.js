export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.message === "Invalid credentials")
    return res.status(400).json({ message: err.message });

  if (err.message === "Unauthorized")
    return res.status(401).json({ message: err.message });

  return res.status(500).json({ message: "Internal Server Error" });
};
