const jwt = require('jsonwebtoken');

const login = (req, res) => {
  const { password } = req.body;
  
  if (password.trim() === process.env.ADMIN_PASSWORD.trim()) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.status(200).json({ token });
  } else {
    return res.status(401).json({ error: 'Invalid password' });
  }
};

module.exports = { login };
