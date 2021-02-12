"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const mysql_1 = __importDefault(require("mysql"));
const db = mysql_1.default.createConnection({
    host: "127.0.0.1",
    port: 6603,
    user: "root",
    password: "yolo",
    database: "users"
});
exports.db = db;
//# sourceMappingURL=db.js.map