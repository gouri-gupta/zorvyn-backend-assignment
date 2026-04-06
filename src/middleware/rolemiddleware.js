
//rolemiddleware is a function that Checks if the logged-in user has permission to perform an action
//we already have request.user from authmiddleware where we have userID and role of the user

//roleMiddleware is a function that returns a function
//roleMiddleware(allowedRoles) → returns middleware
//because we want to pass roles like roleMiddleware("admin") ; roleMiddleware("admin", "analyst")

const roleMiddleware = (...allowedRoles) => {
  return (request, response, next) => {
    try {
      const userRole = request.user.role;

      if (!allowedRoles.includes(userRole)) {
        return response.status(403).send({
          message: "Access denied",
          success: false
        });
      }

      next();
    } catch (error) {
      return response.status(500).send({
        message: "Role check failed",
        success: false
      });
    }
  };
};

export default roleMiddleware;

// ...allowedRoles  = allows us to pass multiple roles like eg roleMiddleware("admin") ; roleMiddleware("admin", "analyst")

/*
Flow in Request
1 Request comes
2 authMiddleware runs → sets request.user
3 roleMiddleware runs → checks role
4 If allowed → controller runs
*/

