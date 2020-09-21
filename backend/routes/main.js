const router = require('express').Router();
const bodyParser = require('body-parser');
const childProcess = require('child_process');
const postgree = require('../systems/postgree');

router.use(bodyParser.json({
    extendet: true,
    limit: '150mb',
    type: 'text/json',
}));
router.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin')
        return res.json({ result: true, title: 'Аутентификация пользователя.', message: 'Здравствуйте, админ.', admin: true });
    const response = await postgree.select('*', 'client', `WHERE client.login = '${username}'`);
    const user = response[0];
    if(!user)
        return res.json({ result: false, title: 'Аутентификация пользователя.', message: 'Не найдено.' });
    if (user.clientpassword !== password)
        return res.json({ result: false, title: 'Аутентификация пользователя.', message: 'Неверный пароль.' });
    return res.json({ result: true, title: 'Аутентификация пользователя.', message: 'Добро Пожаловать', admin: false });
});
router.post('/any', async (req, res) => {
    const response = await postgree.any(req.body.query);
    if (!response) {
        return res.json({ result: false, title: 'Запрос', message: 'Не прошел' });
    }
    return res.json({ result: true, title: 'Запрос', message: 'Успешно', return: response });
});
router.post('/select', async (req, res) => {
    console.log('res start')
    const response = await postgree.select(req.body.columns, req.body.tables, req.body.cond);
    // console.log('res end', response)
    if (!response) {
        return res.json({ result: false, title: 'Получение данных.', message: 'Данные не найдены' });
    }
    return res.json({ result: true, title: 'Получение данных.', message: 'Успешно', return: response });
});

router.post('/regUser', async (req, res) => {
    let data = req.body;
    const findUser = await postgree.select('*', 'customer', `where login='${data.login}'`);
    if(findUser.length) {
        return res.json({ result: false, title: 'Регистрация.', message: 'Такой пользователь существует.' });
    }
    const date = new Date();
    return res.json({ result: true, title: 'Регистрация пользователей.', message: 'Успешно' });
});

router.post('/setdump', async (req, res) => {
    const credentials = {
        host: 'localhost',
        user: 'postgres',
        pass: 3213,
        port: 5432,
        db_name: 'postgres',
    };

    try{
        const dumpCommand = `pg_dump --dbname=postgresql://${credentials.user}:${credentials.pass}@${credentials.host}:${credentials.port}/${credentials.db_name} -Fc > dump_${credentials.db_name}_finish.sql`;
        const dumpResult = await childProcess.execSync(dumpCommand);
        let d = dumpResult.toString();
        return res.json({ result: true, title: 'Дамп БД', message: d });
    } catch (error) {
        return res.json({ result: false, title: 'дамп БД', message: error.message });
    }
});
router.post('/getdump', async (req, res) => {
    const credentials = {
        host: 'localhost',
        user: 'postgres',
        pass: 3213,
        port: 5432,
        db_name: 'postgres',
    };

    try{
        const dumpCommand = `pg_restore --clean --dbname=postgresql://${credentials.user}:${credentials.pass}@${credentials.host}:${credentials.port}/${credentials.db_name} < dump_${credentials.db_name}_finish.sql`;
        const dumpResult = await childProcess.execSync(dumpCommand);
        let d = dumpResult.toString();
        return res.json({ result: true, title: 'Дамп БД', message: d });
    } catch (error) {
        return res.json({ result: false, title: 'дамп БД', message: error.message });
    }
});

router.post('/insert', async (req, res) => {
    try {
        await postgree.insert(req.body.tables, req.body.data);
        return res.json({ result: true, title: 'Добавление данных', message: 'Успех' });
    } catch (error) {
        return res.json({ result: false, title: 'Добавление данных', message: error.message });
    }
});

router.post('/update', async (req, res) => {
    try {
        await postgree.update(req.body.table, req.body.values, req.body.cond);
    } catch (error) {
        return res.json({ result: false, title: 'Обновление данных.', message: error.message });
    }
    return res.json({ result: true, title: 'Обновление данных.', message: 'Успешно' });
});

router.post('/delete', async (req, res) => {
    try {
        await postgree.delete(req.body.table, req.body.where);
        return res.json({ result: true, title: 'Удаление данных.', message: 'Успешно' });
    } catch (error) {
        return res.json({ result: false, title: 'Удаление сотрудников.', message: error.message });
    }
});

module.exports = router;
