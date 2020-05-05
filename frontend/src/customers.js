import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';

const showHuman = (index, data, FetchData, setModify, setFirstname, setMiddletname, setLasttname, setLogin, setPassword, setTelephone, setOpen, openState, setId) => {
    const del = () => {
        axios.post('http://localhost:8000/delete', { table: 'customer', where: `idcustomer=${data.idcustomer}` })
            .then((req, res) => {
                    if (req.data.result === true){
                        FetchData();
                    }
                }
            ).catch((err) => {
            console.log(err);
        });
    };
    const edit = () => {
        setId(data.idcustomer);
        setModify(true);
        setFirstname(data.firstname);
        setMiddletname(data.middletname);
        setLasttname(data.lasttname);
        setLogin(data.login);
        setTelephone(data.telephone);
        setPassword(data.password);
        setOpen(!openState);
    };
    return (
        <div className="single_customer">
            <div>{data.idcustomer}</div>
            <div>{data.firstname}</div>
            <div>{data.middletname}</div>
            <div>{data.lasttname}</div>
            <div>{data.telephone}</div>
            <div>{data.login}</div>
            <div>{data.password}</div>
            <button className="btn_main azure" onClick={del}>удалить</button>
            <button className="btn_main azure" onClick={edit}>изменить</button>
        </div>
    )
};

const Customers = () => {
    const [data, setData] = useState([]);
    const [openState, setOpen] = useState(false);
    const [id, setId] = useState();
    const [firstname, setFirstname] = useState('');
    const [middletname, setMiddletname] = useState('');
    const [lasttname, setLasttname] = useState('');
    const [login, setLogin] = useState('');
    const [telephone, setTelephone] = useState('');
    const [password, setPassword] = useState('');
    const [modify, setModify] = useState(false);
    const FetchData = async () => {
        await axios.post('http://localhost:8000/select', { columns: '*', tables: 'customer' })
            .then((req, res) => {
                    setData(req.data.return);
                }
            ).catch((err) => {});
    };
    useEffect(() => {
        setInterval(FetchData, 1000);
    }, []);
    const createNewWorker = () => {
        setOpen(!openState);
        let columnsT = 'firstname, middletname, lasttname, login, password, telephone';
        let val = `'${firstname}', '${middletname}', '${lasttname}', '${login}', '${password}', '${telephone}'`;
        let data = {
            columns: columnsT,
            values: val,
        };
        if ((firstname !== '') && (middletname !== '') && (lasttname !== '')){
            axios.post('http://localhost:8000/insert', { data: data, tables: 'customer' })
                .then((req, res) => {
                        if (req.data.result === true){
                            FetchData();
                        }
                    }
                ).catch((err) => {});
        } else {        }
    };
    const UpdateData = () => {
        setOpen(!openState);
        let where = `idcustomer = ${id}`;
        let values = `firstname = '${firstname}', middletname = '${middletname}', lasttname = '${lasttname}', telephone = '${telephone}', login = '${login}', password = '${password}'`;
        axios.post('http://localhost:8000/update', { table: 'customer', values: values, cond: where })
            .then(async (req, res) => {
                }
            ).catch((err) => {
            console.log(err);
        });
    };
    const EachSetting = (data, i) => (
        <>
            {showHuman(i, data, FetchData, setModify, setFirstname, setMiddletname, setLasttname, setLogin, setPassword, setTelephone, setOpen, openState, setId)}
        </>
    );
    const showNewWorker = (open) => {
        setModify(false);
        setOpen(!openState);
    };
    const Field = () => data && data.map(EachSetting);
    return (
        <>
            <div>
                <div className="infoWorker">
                    <div>ID</div>
                    <div>Имя</div>
                    <div>Отчество</div>
                    <div>Фамилия</div>
                    <div>Телефон</div>
                    <div>Логин</div>
                    <div>Пароль</div>
                </div>
                {Field()}
            </div>
            <div style={{ display: openState === true ? 'grid' : 'none' }} className="newWorker">
                <div>Фамилия</div>
                <input value={lasttname} onChange={(e) => setLasttname(e.target.value)}/>
                <div>Имя</div>
                <input value={firstname} onChange={(e) => setFirstname(e.target.value)}/>
                <div>Отчество</div>
                <input value={middletname} onChange={(e) => setMiddletname(e.target.value)}/>
                <div>Телефон</div>
                <input value={telephone} onChange={(e) => setTelephone(e.target.value)}/>
                <div>Логин</div>
                <input value={login} onChange={(e) => setLogin(e.target.value)}/>
                <div>Пароль</div>
                <input value={password} onChange={(e) => setPassword(e.target.value)}/>
                <button className="btn_main azure" disabled={(lasttname && firstname && middletname && telephone && login && password) ? false : true} onClick={() => {modify === false ? createNewWorker() : UpdateData() }} >{!modify ? 'Создать' : 'Сохранить'}</button>
                <button className="btn_main azure" onClick={() => setOpen(false)}>Закрыть</button>
            </div>
            <button className="btn_main" onClick={() => showNewWorker(true)} >Новая запись</button>
        </>
    );
};

export default withRouter(Customers);
