import React, {useState} from 'react';


const Sign = (props) => {
    const [name, setName] = useState('');
    const [lastname, setLastName] = useState('');
    const [middlename, setMiddleName] = useState('');
    const [telephone, setTelephone] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    return(
    <div className="enter_landing form">
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
        <div>{props.error}</div>
        <div style={{marginTop: '15px'}} className="btn_form">
            <button className="btn_main" onClick={() => props.register(name, lastname, middlename, login, password, telephone)}>Зарегистрироваться</button>
            <button className="btn_main" onClick={() => {props.setOpenRegister(false); props.setOpenEnter(true)}}>Войти</button>
            <button className="btn_main" onClick={() => props.setOpenRegister(false)}>Закрыть</button>
        </div>
    </div>
    )
}

export default Sign;