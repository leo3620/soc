import mysql from 'mysql';

const db = mysql.createConnection({
    host: "host.docker.internal",
    port: 6603,
    user: "root",
    password: "yolo",
    database: "users"
});

export {db};
