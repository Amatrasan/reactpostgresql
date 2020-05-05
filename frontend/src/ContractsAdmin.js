import React, {useState, useEffect} from 'react';
import axios from 'axios';

const Contracts = (props) => {
    const [dataContract, setData] = useState([]);
    const Fetch = async () => {
        let res = await axios.post('http://localhost:8000/select', { columns: 'contract.startdate, contract.enddate, contract.cost, contract.status, contract.description, worker.firstname as wfirstname, worker.middletname as wmiddletname, worker.lasttname as wlasttname, customer.firstname, customer.middletname, customer.lasttname', tables: 'contract', cond: `left join worker on worker.idworker = contract.worker left join deliverycompany on deliverycompany.idcompany = contract.delivery left join customer on contract.customer = customer.idcustomer` });
        setData(res.data.return);
    }
    useEffect(() =>{
        Fetch();
    },[])
    const eachContract = (data, i) => {
        return(
        <div className="form manager_contract">
            <div className="image_product_deck">
                <img src={data.image} alt='' />
            </div>
            <div>
                <div className="flex_row date_contract">
                    <div>
                        <div className="h_form">Дата начала работ</div>
                        <input value={data.startdate} type="date" placeholder="Конец"/>
                    </div>
                    <div>
                        <div className="h_form">Дата окончания</div>
                        <input value={data.enddate} type="date" placeholder="Конец"/>
                    </div>
                </div>
                <div>Заказчик: <b>{data.lasttname} {data.firstname} {data.middletname}</b></div>
                <div>Фирма доставки: <b>{data.name}</b></div>
                <div>Описание: {data.description}</div>
                <div>Цена: <b>{data.cost}</b></div>
                <div>Статус: {data.status}</div>
                <div>Менеджер: <b>{data.wlasttname} {data.wfirstname} {data.wmiddletname}</b></div>
            </div>
        </div>
        )
    };
    const Field = () => dataContract && dataContract.map(eachContract);
    return(
        <div>
            {Field()}
        </div>
    )
}

export default Contracts;