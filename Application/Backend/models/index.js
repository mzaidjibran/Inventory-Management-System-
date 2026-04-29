import UserModel from "./UserModel.js";
import RefreshToken from "./refreshToken.js";

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

export { UserModel, RefreshToken };
