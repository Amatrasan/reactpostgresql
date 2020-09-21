import React, {useState, useEffect} from 'react';
import axios from 'axios';

const Contracts = (props) => {
    const [dataContract, setData] = useState([]);
    useEffect(() =>{setData(props.contracts)}, [props])
    const eachContract = (data, i) => {
        const accept = (bool) => {
            let where = `idcontract = ${data.idcontract}`;
            let values = `cost = '${data.cost}', worker = '${props.id}', status = '${bool ? 'Принято' : 'Отклонено'}'`;
            axios.post('http://localhost:8000/update', { table: 'contract', values: values, cond: where })
                .then(async (req, res) => {
                    props.fetchManagerUse();
                    }
                ).catch((err) => {
                console.log(err);
            });
        }
        const handleInput = (e) => {
            let temp = dataContract;
            temp[i].cost = e.target.value;
            setData(temp);
        }
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
                {(data.status === 'На рассмотрении') ? (
                    <>
                <h5 className="h_form">Цена:</h5>
                <div className="flex_space">
                    <input value={data.cost} onChange={handleInput}/>
                    <button className="btn_main azure" onClick={() => accept(true)}>Принять</button>
                    <button className="btn_main azure" onClick={() => accept(false)}>Отклонить</button>
                </div>
                    </>
                ) : (
                    <>
                    <div>Цена: <b>{data.cost}</b></div>
                    <div>Статус: {data.status}</div>
                    </>
                )}

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
