import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';

const showSmithy = (i, data, FetchData, setModify, setName, setAdres, setOpen, openState, setId) => {
    const del = () => {
        axios.post('http://localhost:8000/delete', { table: 'smithy', where: `idsmithy=${data.idsmithy}` })
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
        setId(data.idsmithy);
        setModify(true);
        setAdres(data.adres);
        setName(data.name_smithy);
        setOpen(!openState);
    };
    return (
        <div className="single_smithy">
            <div>{data.idsmithy}</div>
            <div>{data.adres}</div>
            <div>{data.name_smithy}</div>
            <button className="btn_main azure" onClick={del}>удалить</button>
            <button className="btn_main azure" onClick={edit}>изменить</button>
        </div>
    )
};

const Smithys = () => {
    const [data, setData] = useState([]);
    const [name, setName] = useState('');
    const [adres, setAdres] = useState('');
    const [openState, setOpen] = useState(false);
    const [id, setId] = useState();
    const [modify, setModify] = useState(false);
    const FetchData = async () => {
        await axios.post('http://localhost:8000/select', { columns: '*', tables: 'smithy' })
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
        let columnsT = 'adres, name_smithy';
        let val = `'${adres}', '${name}'`;
        let data = {
            columns: columnsT,
            values: val,
        };
        if ((name !== '') && (adres !== '')){
            axios.post('http://localhost:8000/insert', { data: data, tables: 'smithy' })
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
        let where = `idsmithy = ${id}`;
        let values = `adres = '${adres}', name_smithy = '${name}'`;
        axios.post('http://localhost:8000/update', { table: 'smithy', values: values, cond: where })
            .then(async (req, res) => {
                }
            ).catch((err) => {
            console.log(err);
        });
    };
    const EachSetting = (data, i) => (
        <>
            {showSmithy(i, data, FetchData, setModify, setName, setAdres, setOpen, openState, setId)}
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
                    <div className="infoSmithy">
                        <div>ID</div>
                        <div>Название</div>
                        <div>Адрес</div>
                    </div>
                    {Field()}
                </div>
                <div style={{ display: openState === true ? 'grid' : 'none' }} className="newWorker">
                    <div>Название</div>
                    <input value={name} onChange={(e) => setName(e.target.value)}/>
                    <div>Адрес</div>
                    <input value={adres} onChange={(e) => setAdres(e.target.value)}/>
                    <button className="btn_main azure" disabled={(name && adres) ? false : true} onClick={() => {modify === false ? createNewSmithy() : UpdateData() }} >{!modify ? 'Создать' : 'Сохранить'}</button>
                    <button className="btn_main azure" onClick={() => setOpen(false)}>Закрыть</button>
                </div>
                <button className="btn_main" onClick={() => showNewSmithy(true)} >Новая кузня</button>
        </>
    );
};

export default withRouter(Smithys);
