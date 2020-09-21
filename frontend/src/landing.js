import React, { useState, useEffect, useRef } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import AddContract from './AddContract';
import Sign from './SigIn';
import Register from './Register';
import AccountSetting from './account_setting';
import history from './history';
import './style/landing.scss'
import { CSVLink } from 'react-csv';

let id = 0;
const setId = (idTemp) => {
    id = idTemp;
}

export const getId = () => id;

const Landing = (props) => {
    const csvInstance = useRef()
    const [csvData, setCsvData] = useState(null)

    const [data, setData] = useState([]);
    const [idAuthUser, setIdAuthUser] = useState();
    const [dataMetals, setDataMetals] = useState([]);
    const [product_metal, setP_M] = useState([])
    const [contracts, setContracts] = useState([]);
    const [firstname, setFirst] = useState('Гость')

    const [auth, setAuth] = useState(false);
    const [openEnter, setOpenEnter] = useState(false);
    const [openSetting, setOpenSetting] = useState(false);
    const [openRegister, setOpenRegister] = useState(false);
    const [openBasket, setOpenBasket] = useState(false);
    const [dataBasket, setDataBasket] = useState([]);
    const [error, setError] = useState('');
    const [openContract, setOpenContract] = useState(false);
    const FetchData = async () => {
        await axios.post('http://localhost:8000/select', { columns: '*', tables: 'product', cond: 'join smithy on product.idsmithy=smithy.idsmithy' })
            .then((req, res) => { setData(req.data.return); }).catch((err) => {});
    }
    const GetContracts = async () => {
        await axios.post('http://localhost:8000/select', { columns: 'contract.startdate, contract.enddate, contract.cost, deliverycompany.name, contract.status, contract.idcontract, worker.lasttname, worker.firstname, worker.middletname', tables: 'contract', cond: `left join deliverycompany on deliverycompany.idcompany = contract.delivery left join worker on contract.worker = worker.idworker where customer=${idAuthUser}`})
        .then((req, res) => { setContracts(req.data.return); }).catch((err) => {});
    }
    const GetMetals = async () => {
        await axios.post('http://localhost:8000/select', { columns: '*', tables: 'metal' })
        .then((req, res) => { setDataMetals(req.data.return); }).catch((err) => {});
    }

    const GetKeysMetalsProducts = async () => {
        return await axios.post('http://localhost:8000/select', { columns: '*', tables: 'product_metal' })
        .then((req, res) => { setP_M(req.data.return); }).catch((err) => {});
    }
    useEffect(() => {
        let cleanupFunction = true;
        const fetchEffect = () => {
            setTimeout(() => {
                if (!cleanupFunction){
                    FetchData();
                    fetchEffect();
                }
            }, 5000)
        }
        fetchEffect();
        return () => cleanupFunction = true;
    },[])
    useEffect(() => {


        FetchData();
        GetMetals();

        GetKeysMetalsProducts();

    }, []);

    const getBasket = async () => {
        let res = await axios.post('http://localhost:8000/select', { columns: 'product.name, id_basket, id_customer, basket.count as countinbasket, product.count, product.cost, product.idproduct', tables: 'basket', cond: `left join product on basket.id_product=product.idproduct left join customer on customer.idcustomer=${idAuthUser}` })
        setDataBasket(res.data.return);
    }
    const buy = async (id_product, i) => {
            let columnsT = 'id_customer, id_product';
            let val = `'${idAuthUser}', '${id_product}'`;
            let data = {
                columns: columnsT,
                values: val,
            };
            await axios.post('http://localhost:8000/insert', { data: data, tables: 'basket' })
            getBasket();

    }
    const deleteFromBasket = async (idProduct) => {
        await axios.post('http://localhost:8000/delete', { table: 'basket', where: `id_customer=${idAuthUser} and id_product=${idProduct}` })
        getBasket();
    }
    const EachSetting = (data, i) => {
        if (data.count > 0){
            return(
                <div className="product_deck" key={i}>
                    <div className="image_product_deck" style={{backgroundImage: `url(${data.image})`}}>

                    </div>
                    <div>
                        <div>{data.name}</div>
                        <div className="product_deck_cost_count">
                            <div>Колличество: {data.count} шт.</div>
                            <div>Цена: <span>{data.cost}</span> руб.</div>
                        </div>
                        <div className="product_deck_description">
                            Описание: <i>{data.description}</i>
                        </div>
                        <div className="product_metal_list">
                            <div>Металлы:</div>
                            {product_metal.map((temp, j) => {
                                if (temp.id_product === data.idproduct){
                                    return dataMetals.map((kek, n) => {
                                        if (temp.id_metal === kek.idmetal){
                                            return <div className="product_metal" key={n}>{kek.name}</div>
                                        } else {
                                            return null
                                        }
                                    })
                                } else {
                                    return null
                                }
                            })}
                        </div>
                        <div className="product_deck_location">
                            <div>Месторасположение:</div>
                            <div>
                                <div>{data.name_smithy}</div>
                                <div>{data.adres}</div>
                            </div>
                        </div>

                        <div style={{display: 'flex', width: '100%', justifyContent: 'flex-end', marginTop: '15px'}}>
                            {auth === true && <button className="btn_main azure" onClick={() => { if(acceptBy(data.idproduct)) buy(data.idproduct, i)}}>В корзину</button>}
                        </div>
                    </div>
                </div>
            );
        }
        };
    const EachBasket = (data, i) => {
           const plusCount = () => {
               let ff = [...dataBasket];
               if (data.count > ff[i].countinbasket){
                ff[i].countinbasket += 1;
                setDataBasket(ff);
               }
           }
           const minusCount = () => {
            let ff = [...dataBasket];
            if (ff[i].count > 1){
                ff[i].countinbasket--;
                setDataBasket(ff);
            }
        }
            return(
            <div className="basket_single">
                <div>{data.name}</div>
                <div>
                    <div>{data.countinbasket} шт, макс: {data.count} шт.</div>
                    <div>
                        <button className="btn_dop" onClick={() => minusCount()}>-</button>
                        <button className="btn_dop" onClick={() => plusCount()}>+</button>
                    </div>
                </div>
                <div>
                    <div>Цена: {data.cost} руб.</div>
                    <button className="btn_delete" onClick={() => deleteFromBasket(data.idproduct)}>Удалить</button>
                </div>
            </div>
            )
        };
    const eachContract = (data, i) => {
        return(
            <div className="form single_contract">
                <div className="flex_space">
                    <div>
                        <div>
                            Дата начала
                        </div>
                        <div>
                            {data.startdate}
                        </div>
                    </div>
                    <div>
                        <div>
                            Дата окончания
                        </div>
                        <div style={{textAlign: 'right'}}>
                            {data.enddate}
                        </div>
                    </div>
                </div>
                <div>
                    Менеджер: <b>{data.firstname} {data.middletname ? data.middletname[0] : ''}. {data.lasttname}</b>
                </div>
                <div>
                    Доставка: <b>{data.name}</b>
                </div>
                <div className="flex_space">
                    <div>
                        Цена: {data.cost}
                    </div>
                    <div>
                        Статус: <b><i>{data.status}</i></b>
                    </div>
                </div>
                {data.status === 'Рассмотрено' ? (
                <div className="flex_space">
                    <button className="btn_main azure" >принять</button>
                    <button className="btn_delete" onClick={() => console.log(data.idproduct)}>Отказаться</button>
                </div>
                ): null}
            </div>
        )
    }
    const FieldBasket = () => dataBasket && dataBasket.map(EachBasket);
    const Field = () => data && data.map(EachSetting);
    const enter = async (login, password) => {
        if (login === 'admin' && password === 'admin'){
            props.setOptionAuth('Admin');
            history.push('/admin');
        }
        let manager = await axios.post('http://localhost:8000/select', { columns: '*', tables: 'worker', cond: `where login='${login}' and password='${password}'` })
        if (manager.data.return.length !== 0){
            setId(manager.data.return[0].idworker);
            props.setOptionAuth('Manager');
            history.push('/manager');
            return
        }
        let res = await axios.post('http://localhost:8000/select', { columns: '*', tables: 'customer', cond: `where login='${login}' and password='${password}'` })
        if (res.data.return.length === 0){
            setError('Пользователь не найден');
        } else {
            setAuth(true)
            setFirst(res.data.return[0].firstname);
            setOpenEnter(false);
            setIdAuthUser(res.data.return[0].idcustomer);
            props.setOptionAuth('User');
        }
    }
    const register = async (name, lastname, middlename, login, password, telephone) => {
        if (name === '' && lastname === '' && middlename === '' && login === '' && password === '' && telephone === ''){
            setError('Введены не все данные');
        } else {
            let res = await axios.post('http://localhost:8000/regUser', { login: login })
            if (res.data.result === true){
                let columnsT = 'firstname, middletname, lasttname, login, password, telephone';
                let val = `'${name}', '${middlename}', '${lastname}', '${login}', '${password}', '${telephone}'`;
                let data = {
                    columns: columnsT,
                    values: val,
                };
            let reg = await axios.post('http://localhost:8000/insert', { data: data, tables: 'customer' })
                if (reg.data.result === true){
                    setFirst(name);
                    setOpenRegister(false)
                    setAuth(true);
                } else {
                    setError(reg.data.message)
                }
            } else {
                setError(res.data.message)
            }
        }
    }

    const exit = () => {
        setFirst('Гость');
        setAuth(false);
    }
    const acceptBy = (idproduct) => {

        let success = dataBasket.find(data => data.idproduct === idproduct);
        if (success){
            return false
        } else {
            return true
        }
    }
    const buyBasket = async () => {
        let any = await axios.post('http://localhost:8000/any', { query: 'INSERT INTO cheque default values' });
        let check = await axios.post('http://localhost:8000/select', { columns: 'cheque.idcheque', tables: 'cheque', cond: 'where idcheque = (select max(idcheque) from cheque)' });
        let columnsT = 'cost, idproduct, count, idcustomer, idcheque';
        let del = false;
        for(let i = 0; i < dataBasket.length; i++){
            let val = `'${dataBasket[i].cost * dataBasket[i].countinbasket}', '${dataBasket[i].idproduct}', '${dataBasket[i].countinbasket}', '${idAuthUser}', '${check.data.return[0].idcheque}'`;
            let data = {
                columns: columnsT,
                values: val,
            };
            let res = await axios.post('http://localhost:8000/insert', { data: data, tables: 'orderproduct' });
            if (res.data.result === true){
                del = true
            }
        }
        let order = await axios.post('http://localhost:8000/select', { columns: 'product.name, orderproduct.cost, orderproduct.count, cheque.date', tables: 'orderproduct', cond: `left join product on orderproduct.idproduct = product.idproduct left join cheque on orderproduct.idcheque = cheque.idcheque where orderproduct.idcheque = ${check.data.return[0].idcheque}` });



        const orderData = order.data.return
        orderData.push({ name: '', count: '', cost: orderData.reduce((prev, cur) => {
                return parseInt(prev, 10) + parseInt(cur.cost, 10);
            }, 0), date: orderData[orderData.length - 1].date })
        const clearOrder = orderData.map((order, i) => {
            return { ...order, name: i < orderData.length - 1 ? order.name : 'Общ. стоимость', date: i < orderData.length - 1 ? '' : order.date}
        })
        setCsvData({
            data: clearOrder,
            headers: [  { label: "Название", key: "name" },
                { label: "Кол-во", key: "count" },
                { label: "Стоимость", key: "cost" },
                { label: "Дата", key: "date" }
                ],
            filename: 'ЧЕК.csv'
        })
        if (del){
            await axios.post('http://localhost:8000/delete', { table: 'basket', where: `id_customer=${idAuthUser}` })
            getBasket();
        }
    }
    useEffect(() => {
        const getCsv = () => {
            if (csvInstance.current.link) {
                csvInstance.current.link.click()
                setCsvData(null)
            }
        }
        let timer = null
        if (csvData) {
            timer = setInterval(getCsv, 200)
        }
        return () => clearInterval(timer)
    }, [csvData, csvInstance])
    const summCount = () => {
        let summ = 0;
        for(let i = 0; i < dataBasket.length; i++){
            summ = summ + (dataBasket[i].countinbasket * dataBasket[i].cost);
        }
        return summ;
    }
    const FieldContract = () => contracts.map(eachContract);
    const [addContract, setAddContract] = useState(false);
    const [findTextState, setFindText] = useState('');
    const findtext = async (e) => {
        setFindText(e.target.value);
        await axios.post('http://localhost:8000/select', { columns: '*', tables: 'product', cond: `where UPPER(name) LIKE UPPER('%${e.target.value}%')` })
        .then((req, res) => { setData(req.data.return); }).catch((err) => {});
    }
    return (
            <div>
                {csvData && <CSVLink
                    data={csvData.data}
                    headers={csvData.headers}
                    filename={csvData.filename}
                    ref={csvInstance}
                    separator={";"}
                />}

                <div className="menu_landing">
                    <h3 style={{marginRight: '10px', marginBottom: '20px'}}>Здравствуйте, <span>{firstname}</span></h3>
                    {!auth? <button className="btn_main" onClick={() => setOpenEnter(true)}>Войти</button> : <></> }
                    {auth? <button className="btn_main" onClick={() => exit()}>Выйти</button> : <></> }
                    {auth? <button className="btn_main" onClick={() => { getBasket(); setOpenBasket(true); }}>Корзина</button> : <></> }
                    {auth? <button className="btn_main" onClick={() => { GetContracts(); setOpenContract(true)}}>Контракты</button> : <></> }
                    {auth? <button className="btn_main" onClick={() => setOpenSetting(true)}>Управление аккаунтом</button> : <></> }
                </div>
                {auth ? <div style={{ right: openBasket ? '0' : '-50vw' }} className="menu_landing_right">
                                <div>
                                    <button className="btn_main" onClick={() => setOpenBasket(false)}>Закрыть</button>
                                </div>
                                {FieldBasket()}
                                <h2 style={{textAlign: 'right'}}>Общая сумма <b>{summCount()}</b> руб.</h2>
                                { dataBasket.length ? <div style={{marginTop: '20px'}}><button className="btn_main azure" onClick={() => buyBasket()}>Купить</button></div> : <></> }
                        </div> : <></> }
                {auth ? <div style={{ right: openContract ? '0' : '-50vw' }} className="menu_landing_right">
                                <div>
                                    <button className="btn_main" onClick={() => setOpenContract(false)}>Закрыть</button>
                                </div>
                                {FieldContract()}
                                <div className="btn_main" onClick={() => setAddContract(true)}>Создать контракт</div>
                        </div> : <></> }
                <div className="product_page">
                    <div className="find_bar" style={{width: '90%', paddingLeft: '50px'}}>
                        <div>
                            <h5>Поиск по названию</h5>
                            <input type="text" value={findTextState} onChange={findtext} />
                        </div>
                    </div>
                    {Field()}
                </div>
                {addContract ? (
                    <div className="wrap">
                        <AddContract idAuthUser={idAuthUser} setAddContract={setAddContract}  />
                    </div>
                 ) : null}
                {openEnter ? (
                    <div className="wrap">
                        <Sign setOpenEnter={setOpenEnter} error={error} enter={enter} setOpenRegister={setOpenRegister} />
                    </div>
                ) : null}
                {openRegister ? (
                    <div className="wrap">
                        <Register register={register} setOpenEnter={setOpenEnter} error={error} setOpenRegister={setOpenRegister} />
                    </div>
                ) : null}
                {openSetting ? (
                    <div className="wrap">
                        <AccountSetting idAuthUser={idAuthUser} setOpenSetting={setOpenSetting} setFirst={setFirst} />
                    </div>
                ) : null}
                <Link to="/manager" id="manager" style={{display: 'none'}} >222</Link>
            </div>
    );
};

export default Landing;
