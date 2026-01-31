module.exports = ({ config, managers }) => {
  return ({ req, res, next }) => {
    const who = { ip: req.ip || req.connection.remoteAddress || 'n/a', ua: req.headers['user-agent'] || '' };
    next(who)
  }
  
}