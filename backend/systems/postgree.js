const assert = require('assert');

const pgp = require('pg-promise')();

let db;

// eslint-disable-next-line func-names
(async function () {
    const conf = 'postgres://postgres:3213@localhost:5432/postgres';
    db = await pgp(conf);
}())
.catch(err => {
    process.exit(1);
});

/**
 * Запрашивает данные из таблицы.
 * @param {object} obj
 * @return {Promise}
 */

module.exports = {

    any: (query) => new Promise(async (resolve, reject) => {
        try {
            const response = await db.any(query);
            resolve(response);
        } catch (error) {
            reject(error);
        }
    }),
    /**
     * Запрашивает данные из таблицы.
     * @param {string} tables
     * @param {string} columns
     * @return {Promise}
     */

    select: (columns, tables, cond) => new Promise(async (resolve, reject) => {
        let t = '';
        t = cond || '';
        try {
            console.log('select start')
            const response = await db.manyOrNone(`SELECT ${columns} FROM ${tables} ${t}`);
            console.log('select end', response)
            resolve(response);
        } catch (error) {
            console.log('select error', error)
            reject(error);
        }
    }),
    /**
     * Записывает данные в таблицу.
     * @param {string} table
     * @param {object} values
     * @return {Promise}
     */
    insert: (table, data) => new Promise(async (resolve, reject) => {
        try {
            assert.strictEqual(typeof table, 'string');
            assert.strictEqual(typeof data, 'object');
            try {
                await db.none(`INSERT INTO ${table}(${data.columns}) VALUES (${data.values})`);
            } catch (error) {
                reject(error);
            }

            resolve(true);
        } catch (error) {
            reject(error);
        }
    }),


    /**
     * Удаляет данные из таблицы.
     * @param {string} table
     * @param {string} cond
     * @return {Promise}
     */
    delete: (table, cond) => new Promise(async (resolve, reject) => {
        try {
            console.log(table, cond);
            assert.strictEqual(typeof table, 'string');
            assert.strictEqual(typeof cond, 'string');



            try {
                await db.none(`DELETE FROM ${table} ${cond !== '' ? 'WHERE' : ''} ${cond}`).then(data => console.log('delete from', data));
            } catch (error) {
                reject(error);
            }

            resolve(true);
        } catch (error) {
            reject(error);
        }
    }),


    /**
     * Запрашивает данные из таблицы.
     * @param {string} table
     * @param {object} values
     * @param {string} cond
     * @return {Promise}
     */
    update: (table, values, cond) => new Promise(async (resolve, reject) => {
        try {
            assert.strictEqual(typeof table, 'string');
            assert.strictEqual(typeof values, 'string');
            assert.strictEqual(typeof cond, 'string');
            try {
                await db.none(`UPDATE ${table} SET ${values} ${cond !== '' ? 'WHERE' : ''} ${cond}`);
            } catch (error) {
                reject(error);
            }

            resolve(true);
        } catch (error) {
            reject(error);
        }
    }),

};
