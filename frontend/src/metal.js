import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';

const showSmithy = (i, data, FetchData, setModify, setName, setDescription, setCost, setOpen, openState, setId) => {
    const del = () => {
        axios.post('http://localhost:8000/delete', { table: 'metal', where: `idmetal=${data.idmetal}` })
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
        setId(data.idmetal);
        setModify(true);
        setDescription(data.description);
        setName(data.name);
        setCost(data.cost);
        setOpen(!openState);
    };
    return (
        <div className="single_metal">
            <div>{data.idmetal}</div>
            <div>{data.name}</div>
            <div>{data.description}</div>
            <div>{data.cost}</div>
            <button className="btn_main azure" onClick={del}>удалить</button>
            <button className="btn_main azure" onClick={edit}>изменить</button>
        </div>
    )
};

const Metal = () => {
    const [data, setData] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [cost, setCost] = useState(0);
    const [openState, setOpen] = useState(false);
    const [id, setId] = useState();
    const [modify, setModify] = useState(false);
    const FetchData = async () => {
        await axios.post('http://localhost:8000/select', { columns: '*', tables: 'metal' })
            .then((req, res) => {
                    setData(req.data.return);
                }
            ).catch((err) => {});
    }
    useEffect(() => {
        setInterval(FetchData, 1000);
    }, []);
    const createNewMetal = () => {
        setOpen(!openState);
        let columnsT = 'name, description, cost';
        let val = `'${name}', '${description}', '${cost}'`;
        let data = {
            columns: columnsT,
            values: val,
        };
        if ((name !== '') && (cost !== null)){
            axios.post('http://localhost:8000/insert', { data: data, tables: 'metal' })
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
        let where = `idmetal = ${id}`;
        let values = `name = '${name}', description = '${description}', cost = ${cost}`;
        axios.post('http://localhost:8000/update', { table: 'metal', values: values, cond: where })
            .then(async (req, res) => {
                }
            ).catch((err) => {
            console.log(err);
        });
    };
    const EachSetting = (data, i) => (
        <>
            {showSmithy(i, data, FetchData, setModify, setName, setDescription, setCost, setOpen, openState, setId)}
        </>
    );
    const showNewMetal = () => {
        setModify(false);
        setOpen(!openState);
    };
    const Field = () => data && data.map(EachSetting);
    return (
        <>
            <div>
                <div className="infoWorker">
                    <div>ID</div>
                    <div>Название</div>
                    <div>Описание</div>
                    <div>Стоимость</div>
                </div>
                {Field()}
            </div>
            <div style={{ display: openState === true ? 'grid' : 'none' }} className="newWorker">
                <div>Название</div>
                <input value={name} onChange={(e) => setName(e.target.value)}/>
                <div>Описание</div>
                <input value={description} onChange={(e) => setDescription(e.target.value)}/>
                <div>Стоимость</div>
                <input value={cost} onChange={(e) => setCost(e.target.value)}/>
                <button className="btn_main azure" disabled={(name && description) ? false : true} onClick={() => {modify === false ? createNewMetal() : UpdateData() }} >{!modify ? 'Создать' : 'Сохранить'}</button>
                <button className="btn_main azure" onClick={() => setOpen(false)}>Закрыть</button>
            </div>
            <button style={{marginLeft: '50px'}} className="btn_main" onClick={() => showNewMetal(true)} >Новый металл</button>
        </>
    );
};

export default withRouter(Metal);
