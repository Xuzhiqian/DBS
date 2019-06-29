import mysql from 'mysql';

function connection() {
        let conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '990212Xuzhiqian!',
            database: 'dblab'
        });
        return conn;
}


export default { connection };