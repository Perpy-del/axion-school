module.exports = class ResponseDispatcher {
  constructor() {
    // No specific dependencies required for dispatching
  }

  /**
   * Standardized Dispatcher
   * @param {Object} res - Express response object
   * @param {Object} params - { ok, data, errors, message, code }
   */
  dispatch(
    res,
    { ok = false, data = {}, errors = [], message = "", code = null },
  ) {

    
    // Determine status code: 200 for success, 400 for validation/logic errors
    let statusCode = code || (ok ? 200 : 400);

    return res.status(statusCode).json({
      ok,
      data,
      errors,
      message,
    });
  }

  /**
   * Special handler for caught errors (Exceptions)
   */
  dispatchError(res, err) {
    let errors = [];
    let message = "An unexpected error occurred";
    let statusCode = 500;

    // Check if it's our custom validation error from ValidatorsLoader
    console.log(err);
    if (err.type === "validation" || err.messages) {
      errors = err.messages || [];
      message = "Validation Failed";
      statusCode = 400;
    } else {
      // Log non-validation errors for debugging
      console.error("Internal Error:", err);
      message = err.message || message;
    }

    return this.dispatch(res, {
      ok: false,
      errors,
      message,
      code: statusCode,
    });
  }
};
