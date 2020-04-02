export default async (req, res, next) => {
  if (req.userId !== 1) {
    return res
      .status(401)
      .json({ error: 'Only administrators can register recipients' });
  }
  return next();
};
