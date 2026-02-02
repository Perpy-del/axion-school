module.exports = ({ managers, config }) => {
  return async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 401,
        errors: "Authentication required. No token provided.",
      });
    }

    try {
      const decoded = managers.utils.verifyToken(token);
      req.user = decoded; 

      req.allowOnly = (roles) => {
        if (!roles.includes(req.user.role)) {
          managers.responseDispatcher.dispatch(res, {
            ok: false,
            code: 403,
            errors: `Access denied. Requires one of the following roles: ${roles.join(", ")}`,
          });
          return false;
        }
        return true;
      };

      next();
    } catch (err) {
      return managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 401,
        errors: "Invalid or expired token.",
      });
    }
  };
};
