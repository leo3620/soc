import mysql from 'mysql';

const db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "yolo?123456",
    database: "users"
});

export {db};
