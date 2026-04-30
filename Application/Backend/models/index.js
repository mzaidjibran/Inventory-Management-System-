import UserModel from "./UserModel.js";
import RefreshToken from "./refreshToken.js";
import Employee from "./Empolyeemodal.js";

UserModel.hasMany(RefreshToken, {
  foreignKey: "userId",
  as: "refreshTokens",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

RefreshToken.belongsTo(UserModel, {
  foreignKey: "userId",
  as: "user",
});

Employee.belongsTo(UserModel, {
  foreignKey: "user",
  as: "userData",
});

export { UserModel, RefreshToken, Employee };
