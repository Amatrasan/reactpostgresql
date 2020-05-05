import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './style/all.scss';

const Orders = (props) => {
    const [Orders, setOrders] = useState([]);
    const [Workers, setWorkers] = useState([{lasttname: '', firstname: '', middletname: ''}]);
    const [smith, setSmith] = useState([]);
    const [openState, setOpen] = useState(false);
    const [object, setObject] = useState({});
    const FetchData = async () => {
        await axios.post('http://localhost:8000/select', { columns: 'orderproduct.cost as ordercost, product.cost as productcost, idorderproduct, orderproduct.count, orderproduct.idcustomer, product.name,customer.lasttname, customer.middletname, customer.firstname, smithy.name_smithy', tables: 'orderproduct', cond: 'left join product on orderproduct.idproduct = product.idproduct left join smithy on product.idsmithy = smithy.idsmithy left join customer on orderproduct.idcustomer = customer.idcustomer' })
            .then((req, res) => {
                setOrders(req.data.return);
                }
            ).catch((err) => {});
    };
    console.log(Orders);
    const FetchSmith = async () => {
        await axios.post('http://localhost:8000/select', { columns: '*', tables: 'worker', cond: `where UPPER(positioninjob) LIKE UPPER('кузнец')`})
        .then((req, res) => {
            setSmith(req.data.return);
            }
        ).catch((err) => {});
    }
    const FetchWorkers = async () => {
        await axios.post('http://localhost:8000/select', { columns: 'workergroup.idorder, workergroup.idworker, worker.firstname, worker.middletname, worker.lasttname, worker.positioninjob', tables: 'workergroup', cond: `left join worker on workergroup.idworker = worker.idworker`})
        .then((req, res) => {
            setWorkers(req.data.return);
            }
        ).catch((err) => {});
    }
    const addWorkers = async (idsmithy) => {
        let columnsT = 'idworker, idorder';
        let val = `'${object.id}', '${object.idorder}'`;
        let data = {
            columns: columnsT,
            values: val,
        };
        axios.post('http://localhost:8000/insert', { data: data, tables: 'workergroup' })
            .then((req, res) => {
                        if (req.data.result === true){}
            }).catch((err) => {});
        let valM = `'${idsmithy}', '${object.idorder}'`;
        let dataV = {
            columns: columnsT,
            values: valM,
        };
        axios.post('http://localhost:8000/insert', { data: dataV, tables: 'workergroup' })
        .then((req, res) => {
                    if (req.data.result === true){
                        FetchData();
                        setOpen(false)
                    }
                }
        ).catch((err) => {});
        setOpen(false);
        FetchWorkers();
        FetchData();
    }
    const getSmith = (ids) => {
        let res = Workers.find(data => ((data.idorder === ids) && (data.positioninjob === 'Кузнец')));
        if (res){
            let str = `${res.lasttname ? res.lasttname : ''} ${res.firstname ? (`${res.firstname[0]}.`) : ''} ${res.middletname ? (`${res.middletname[0]}.`) : ''}`;
            return str;
        }
        else{
            return '';
        }
    }
    const getManager = (ids) => {
        let res = Workers.find(data => ((data.idorder === ids) && (data.positioninjob === 'Менеджер')));
        if (res){
            let str = `${res.lasttname ? res.lasttname : ''} ${res.firstname ? (`${res.firstname[0]}.`) : ''} ${res.middletname ? (`${res.middletname[0]}.`) : ''}`;
            return str;
        } else {
            return '';
        }

    }
    const eachOrder = (data, i) => {
        return(
            <div className="single_order">
                <div>{data.idorderproduct }</div>
                <div>{data.count}</div>
                <div>{data.name}</div>
                <div>{data.ordercost}</div>
                <div>{data.lasttname}</div>
                <div>{data.firstname}</div>
                <div>{data.middletname}</div>
                <div>{data.name_smithy}</div>
                <div>{getSmith(data.idorderproduct)}</div>
                <div>{getManager(data.idorderproduct)}</div>
                {((getManager(data.idorderproduct) === '') && (props.admin !== true)) ? <button className="btn_main azure" onClick={() => {setOpen(true); setObject({idorder: data.idorderproduct, id: props.id});}}>Назначить кузнеца</button> : null}
            </div>
        )
    }
    useEffect(() => {
        FetchWorkers();
        FetchSmith();
        FetchData();
    }, []);
    const compareNumbers = (a, b) => {
        return b.idorderproduct - a.idorderproduct;
    }
    const Sort = () => {
        let temp = [...Orders];
        temp.sort(compareNumbers);
        console.log(temp)
        setOrders(temp)
    }
    const Field = () => Orders.map(eachOrder);
    const eachSmithy = (data, i) => {
        return(
            <div className="smith_single" onClick={() => addWorkers(data.idworker)}>
                <div>{data.lasttname}</div>
                <div>{data.firstname}</div>
                <div>{data.middletname}</div>
            </div>
        )
    }
    return(
        <div>
            {openState ? (
                    <div className="wrap">
                        <div className="form">
                            {smith.map(eachSmithy)}
                        </div>
                    </div>
            ) : null}
            <div className="single_order">
                <div onClick={Sort}><b>ID</b></div>
                <div><b>Кол-во</b></div>
                <div><b>Общ. стоимость</b></div>
                <div><b>Название</b></div>
                <div><b>Фамилия</b></div>
                <div><b>Имя</b></div>
                <div><b>Отчество</b></div>
                <div><b>Кузня</b></div>
                <div><b>Кузнец</b></div>
                <div><b>Менеджер</b></div>
            </div>
            {Orders.length ? Field() : null}
        </div>
    )
};

export default Orders;