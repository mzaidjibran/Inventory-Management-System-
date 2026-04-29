import UserModel from "./UserModel.js";
import RefreshToken from "./refreshToken.js";
import Employee from "./Empolyeemodal.js";
import EmployeeDepartment from "./EmployeeDepartment.js";
import EmployeeDesignation from "./EmployeeDesignation.js";
import Shift from "./Shift.js";

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

Employee.belongsTo(EmployeeDepartment, {
  foreignKey: "department",
  as: "department",
});

Employee.belongsTo(EmployeeDesignation, {
  foreignKey: "designation",
  as: "designation",
});

Employee.belongsTo(Shift, {
  foreignKey: "shift",
  as: "shift",
});

Employee.belongsTo(UserModel, {
  foreignKey: "user",
  as: "userData",
});

export {
  UserModel,
  RefreshToken,
  Employee,
  EmployeeDepartment,
  EmployeeDesignation,
  Shift,
};
