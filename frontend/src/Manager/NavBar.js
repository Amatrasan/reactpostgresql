import React from 'react';
import {Link} from 'react-router-dom'
import '../style/all.scss';

const NavBar = (props) => {

    return(
        <div className="navbar">
            <div onClick={props.openContracts} className="btn_main">Контракты</div>
            <div onClick={props.openOrders} className="btn_main">Заказы</div>
            <div onClick={props.openProducts} className="btn_main">Продукция</div>
            <div onClick={props.openMetals} className="btn_main">Металлы</div>
            <div onClick={props.openDelivery} className="btn_main">Доставка</div>
            <Link to='/' className="btn_main">Выйти</Link>
        </div>
    )
}

export default NavBar;