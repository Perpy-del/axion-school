module.exports = ({ config, managers }) => {
  return ({ req, res, next }) => {
    const token = req.headers.authorization.split(' ')[1] || '';
    const user = token ? managers.token.verifyShortToken({ token }) : null;
    next({ __auth: user || null });
  }
}