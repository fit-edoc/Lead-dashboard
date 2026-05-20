import mongoose, { Schema, Document } from 'mongoose';
export var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "Admin";
    UserRole["SALES_USER"] = "Sales User";
})(UserRole || (UserRole = {}));
const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.SALES_USER },
}, { timestamps: true });
export default mongoose.model('User', UserSchema);
//# sourceMappingURL=User.js.map