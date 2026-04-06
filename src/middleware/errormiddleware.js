const errorMiddleware = (err, request, response, next) => {
    console.error("🔥 Error:", err.message);

    // Default values
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Mongoose Bad ObjectId (CastError)
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID format";
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        statusCode = 400;
        message = "Duplicate field value entered";
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
            .map(val => val.message)
            .join(", ");
    }

    response.status(statusCode).json({
        success: false,
        message: message,
        result: null
    });
};

export default errorMiddleware;