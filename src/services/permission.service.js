const RoleModel = require("../models/role.model");

const PermissionService = {
  async userHasPermission(roleId, permissionName) {
    const permissions = await RoleModel.getPermissions(roleId);
    return permissions.some((p) => p.name === permissionName);
  }
};

module.exports = PermissionService;
