import { verifyToken } from '../utils/jwt.js';
import { CustomError } from '../utils/CustomError.js';
import User, {} from '../models/User.js';
export const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return next(new CustomError('Not authorized to access this route', 401));
        }
        const decoded = verifyToken(token);
        const user = await User.findById(decoded.id).select('-passwordHash');
        if (!user) {
            return next(new CustomError('No user found with this id', 404));
        }
        req.user = user;
        next();
    }
    catch (error) {
        return next(new CustomError('Not authorized to access this route', 401));
    }
};
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new CustomError(`User role ${req.user?.role} is not authorized to access this route`, 403));
        }
        next();
    };
};
//# sourceMappingURL=authMiddleware.js.map