export const login = async (req, res) => {
  const { email, password } = req.body;
  res.status(200).json({ message: "POST /auth/login - not implemented yet" });
};
