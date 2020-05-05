import React, {useState} from 'react';


const Sign = (props) => {
    const [login, setLogin] = useState('Vipera');
    const [password, setPassword] = useState('1234');
    return(
        <div className="enter_landing form">
        <h5 className="h_form">Логин</h5>
        <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} />
        <h5 className="h_form">Пароль</h5>
        <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div>{props.error}</div>
        <div style={{marginTop: '15px'}} className="btn_form">
            <button className="btn_main" onClick={() => {props.setOpenEnter(false); props.setOpenRegister(true)}}>Регистрация</button>
            <button className="btn_main" onClick={() => props.enter(login, password)}>Войти</button>
            <button className="btn_main" onClick={() => props.setOpenEnter(false)}>Закрыть</button>
        </div>
    </div>
    )
}

export default Sign;