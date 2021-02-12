import mysql from 'mysql';

const db = mysql.createConnection({
    host: "mysql",
    port: 3306,
    user: "root",
    password: "yolo",
    database: "users"
});

export {db};
