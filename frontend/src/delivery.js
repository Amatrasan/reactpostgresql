import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';

const showSmithy = (i, data, FetchData, setModify, setName, setCost, setOpen, openState, setId) => {
    const del = () => {
        axios.post('http://localhost:8000/delete', { table: 'deliverycompany', where: `idcompany = ${data.idcompany}` })
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
        setId(data.idcompany);
        setModify(true);
        setCost(data.cost);
        setName(data.name);
        setOpen(!openState);
    };
    return (
        <div className="delivery_single">
            <div>{data.idcompany}</div>
            <div>{data.name}</div>
            <div>{data.cost}</div>
            <button className="btn_main azure" onClick={del}>удалить</button>
            <button className="btn_main azure" onClick={edit}>изменить</button>
        </div>
    )
};

const Delivery = () => {
    const [data, setData] = useState([]);
    const [name, setName] = useState('');
    const [cost, setCost] = useState('');
    const [openState, setOpen] = useState(false);
    const [id, setId] = useState();
    const [modify, setModify] = useState(false);
    const FetchData = async () => {
        await axios.post('http://localhost:8000/select', { columns: '*', tables: 'deliverycompany' })
            .then((req, res) => {
                    setData(req.data.return);
                }
            ).catch((err) => {});
    }
    useEffect(() => {
        setInterval(FetchData, 1000);
    }, []);
    const createNewSmithy = () => {
        setOpen(!openState);
        let columnsT = 'name, cost';
        let val = `'${name}', '${cost}'`;
        let data = {
            columns: columnsT,
            values: val,
        };
        if ((name !== '') && (cost !== '')){
            axios.post('http://localhost:8000/insert', { data: data, tables: 'deliverycompany' })
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
        let where = `idcompany = ${id}`;
        let values = `name = '${name}', cost = '${cost}'`;
        axios.post('http://localhost:8000/update', { table: 'deliverycompany', values: values, cond: where })
            .then(async (req, res) => {
                }
            ).catch((err) => {
            console.log(err);
        });
    };
    const EachSetting = (data, i) => (
        <>
            {showSmithy(i, data, FetchData, setModify, setName, setCost, setOpen, openState, setId)}
        </>
    );
    const showNewSmithy = () => {
        setModify(false);
        setOpen(!openState);
    };
    const Field = () => data && data.map(EachSetting);
    return (
        <>
            <div>
                <div className="info_delivery">
                    <div>ID</div>
                    <div>Название</div>
                    <div>Стоимость</div>
                </div>
                {Field()}
            </div>
            <div style={{ display: openState === true ? 'grid' : 'none' }} className="newWorker">
                <div>Название</div>
                <input value={name} onChange={(e) => setName(e.target.value)}/>
                <div>Стоимость доставки</div>
                <input value={cost} onChange={(e) => setCost(e.target.value)}/>
                <button className="btn_main azure" disabled={(name && cost) ? false : true} onClick={() => {modify === false ? createNewSmithy() : UpdateData() }} >{!modify ? 'Создать' : 'Сохранить'}</button>
                <button className="btn_main azure" onClick={() => setOpen(false)}>Закрыть</button>
            </div>
            <button style={{marginLeft: '50px'}} className="btn_main" onClick={() => showNewSmithy(true)} >Новая компания доставки</button>
        </>
    );
};

export default withRouter(Delivery);
