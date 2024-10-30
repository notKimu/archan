import { Role } from "discord.js";

export function isRoleHigherOrEqual(role: Role, myRole: Role) {
    return role.position >= myRole.position ? true : false;
}