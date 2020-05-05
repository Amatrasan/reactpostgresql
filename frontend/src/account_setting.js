import React, {useState, useEffect} from 'react';
import axios from 'axios';

const AccountSetting = (props) => {
    const [name, setName] = useState('');
    const [lastname, setLastName] = useState('');
    const [middlename, setMiddleName] = useState('');
    const [telephone, setTelephone] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    useEffect(() => {
        axios.post('http://localhost:8000/select', { columns: '*', tables: 'customer', cond: `where idcustomer=${props.idAuthUser} ` })
        .then((req, res) => { 
            if(req.data.return){
                let res = req.data.return[0];
                console.log(res)
                setLastName(res.lasttname);
                setMiddleName(res.middletname);
                setTelephone(res.telephone);
                setPassword(res.password);
                setName(res.firstname);
                setLogin(res.login);
            } 
        }).catch((err) => {});
    },[])
    const save = () => {
        
        let where = `idcustomer = ${props.idAuthUser}`;
        let values = `firstname = '${name}', middletname = '${middlename}', lasttname = '${lastname}', login = '${login}', password = '${password}'`;

        axios.post('http://localhost:8000/update', { table: 'customer', values: values, cond: where })
            .then(async (req, res) => {
                props.setFirst(name);
                }
            ).catch((err) => {
            console.log(err);
        });
    }
    return(
        <div className="form">
            <h5 className="h_form">Имя</h5>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <h5 className="h_form">Фамилия</h5>
            <input type="text" value={lastname} onChange={(e) => setLastName(e.target.value)} />
            <h5 className="h_form">Отчество</h5>
            <input type="text" value={middlename} onChange={(e) => setMiddleName(e.target.value)} />
            <h5 className="h_form">Телефон</h5>
            <input type="text" value={telephone} onChange={(e) => setTelephone(e.target.value)} />
            <h5 className="h_form">Логин</h5>
            <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} />
            <h5 className="h_form">Пароль</h5>
            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}>
                <button className="btn_main" onClick={save}>Сохранить</button>
                <button className="btn_main" onClick={() => props.setOpenSetting(false)}>Закрыть</button>
            </div>
        </div>
    )
}

export default AccountSetting;