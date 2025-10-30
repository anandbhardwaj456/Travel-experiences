import jwt from 'jsonwebtoken';

export const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.sendStatus(403);

  const jwtSecret = process.env.JWT_SECRET || 'dev_secret_change_me';
  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};