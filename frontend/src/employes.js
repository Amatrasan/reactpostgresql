import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import './style/empolye.css'

const showHuman = (index, data, fetch, setBool, setFirstname, setMiddletname, setLasttname, setAdres, setTelephone, setBirthdate, setOpen, open, setID, setLogin, setPassword, setPositioninjob) => {
    const del = () => {
        axios.post('http://localhost:8000/delete', { table: 'worker', where: `idworker=${data.idworker}` })
            .then((req, res) => {
                    if (req.data.result === true){
                        fetch();
                    }
                }
            ).catch((err) => {
                console.log(err);
        });
    };
    const edit = () => {
        setID(data.idworker);
        setBool(true);
        setFirstname(data.firstname);
        setMiddletname(data.middletname);
        setLasttname(data.lasttname);
        setAdres(data.adres);
        setTelephone(data.telephone);
        setBirthdate(data.birthdate);
        setLogin(data.login)
        setPassword(data.password);
        setPositioninjob(data.positioninjob);
        setOpen(!open);
    };
    return (
        <div className="worker">
            <div>{data.idworker}</div>
            <div>{data.firstname}</div>
            <div>{data.middletname}</div>
            <div>{data.lasttname}</div>
            <div>{data.positioninjob}</div>
            <div>{data.adres}</div>
            <div>{data.telephone}</div>
            <div>{data.birthdate}</div>
            <div>{data.login}</div>
            <div>{data.password}</div>
            <button className="btn_main azure" onClick={del}>удалить</button>
            <button className="btn_main azure" onClick={edit}>изменить</button>
        </div>
    )
}

const Employers = () => {
    const [data, setData] = useState([]);
    const [openState, setOpen] = useState(false);
    const [id, setId] = useState();
    const [firstname, setFirstname] = useState('');
    const [middletname, setMiddletname] = useState('');
    const [lasttname, setLasttname] = useState('');
    const [positioninjob, setPositioninjob] = useState('');
    const [telephone, setTelephone] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [adres, setAdres] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [modify, setModify] = useState(false);
    const FetchData = async () => {
        await axios.post('http://localhost:8000/select', { columns: '*', tables: 'worker' })
            .then((req, res) => {
                    setData(req.data.return);
                   // console.log(req);
                }
            ).catch((err) => {});
    }
    useEffect(() => {
        let bool = false;
        const d = () => {
            if (!bool){
                FetchData()
                setTimeout(d, 2000);

            }
        }
       // d();
       FetchData();
        return () => bool = true;
    }, []);
    const createNewWorker = () => {
        setOpen(!openState);
        let columnsT = 'firstname, middletname, lasttname, positioninjob, telephone, birthdate, adres, password, login';
        let val = `'${firstname}', '${middletname}', '${lasttname}', '${positioninjob}', '${telephone}', '${birthdate}', '${adres}', '${password}', '${login}'`
        let data = {
            columns: columnsT,
            values: val,
        };
        if ((firstname !== '') && (middletname !== '') && (lasttname !== '')){
            axios.post('http://localhost:8000/insert', { data: data, tables: 'worker' })
                .then((req, res) => {
                        if (req.data.result === true){
                            FetchData();
                        }
                    }
                ).catch((err) => {});
        } else {

        }
    };
    const UpdateData = () => {
        setOpen(!openState);
        let where = `idworker = ${id}`;
        let values = `firstname = '${firstname}', middletname = '${middletname}', lasttname = '${lasttname}', positioninjob = '${positioninjob}', adres = '${adres}', telephone = '${telephone}', birthdate = '${birthdate}', login = '${login}', password = '${password}'`;
        axios.post('http://localhost:8000/update', { table: 'worker', values: values, cond: where })
            .then(async (req, res) => {
                }
            ).catch((err) => {
            console.log(err);
        });
    };
    const EachSetting = (data, i) => (
        <>
            {showHuman(i, data, FetchData, setModify, setFirstname, setMiddletname, setLasttname, setAdres, setTelephone, setBirthdate, setOpen, openState, setId, setLogin, setPassword, setPositioninjob)}
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
                <div className="infoEmployes">
                    <div>ID</div>
                    <div>Имя</div>
                    <div>Отчество</div>
                    <div>Фамилия</div>
                    <div>Должность</div>
                    <div>Адрес</div>
                    <div>Телефон</div>
                    <div>Дата рождения</div>
                    <div>Логин</div>
                    <div>Пароль</div>
                </div>
                {Field()}
            </div>
            <div style={{ display: openState === true ? 'grid' : 'none' }} className="newWorker">
                <h3 className="h_form">Фамилия</h3>
                <input value={lasttname} onChange={(e) => setLasttname(e.target.value)}/>
                <h3 className="h_form">Имя</h3>
                <input value={firstname} onChange={(e) => setFirstname(e.target.value)}/>
                <h3 className="h_form">Отчество</h3>
                <input value={middletname} onChange={(e) => setMiddletname(e.target.value)}/>
                <h3 className="h_form">Должность</h3>
                <input value={positioninjob} onChange={(e) => setPositioninjob(e.target.value)}/>
                <h3 className="h_form">Адрес проживания</h3>
                <input value={adres} onChange={(e) => setAdres(e.target.value)}/>
                <h3 className="h_form">Дата рождения</h3>
                <input value={birthdate} onChange={(e) => setBirthdate(e.target.value)}/>
                <h3 className="h_form">Контактный телефон</h3>
                <input value={telephone} onChange={(e) => setTelephone(e.target.value)}/>
                <h3 className="h_form">Логин</h3>
                <input value={login} onChange={(e) => setLogin(e.target.value)}/>
                <h3 className="h_form">Пароль</h3>
                <input value={password} onChange={(e) => setPassword(e.target.value)}/>
                <button className="btn_main azure" disabled={(lasttname && firstname && middletname && positioninjob && adres && birthdate && telephone && login && password) ? false : true} onClick={() => {modify === false ? createNewWorker() : UpdateData() }} >{!modify ? 'Создать' : 'Сохранить'}</button>
                <button className="btn_main azure" onClick={() => setOpen(false)}>Закрыть</button>
            </div>
            <button style={{marginLeft: '50px', marginTop: '20px'}} className="btn_main" onClick={() => showNewWorker(true)} >Создать нового сотрудника</button>
        </>
    );
};

export default Employers;
