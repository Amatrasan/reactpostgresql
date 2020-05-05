import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import './style/product.css'


let File = null;
let imagePreviewUrl = null;
const Products = () => {

    const [d, setD] = useState();
    const [data, setData] = useState([]);
    const [id, setId] = useState();
    const [openState, setOpen] = useState(false);
    const [modify, setModify] = useState(false);
    const [name,setName] = useState();
    const [cost,setCost] = useState();
    const [count,setCount] = useState();
    const [metals,setMetals] = useState([]);
    const [smithy,setSmithy] = useState();
    const [descr, setDescr] = useState();
    const [dataMetals, setDataMetals] = useState([]);
    const [dataSmithy, setDataSmithy] = useState([]);
    const FetchData = async () => {
        await axios.post('http://localhost:8000/select', { columns: '*', tables: 'product', cond: 'join smithy on product.idsmithy=smithy.idsmithy' })
            .then((req, res) => { setData(req.data.return); }).catch((err) => {});
    }
    const GetMetals = async () => {
        await axios.post('http://localhost:8000/select', { columns: '*', tables: 'metal' })
        .then((req, res) => { setDataMetals(req.data.return); }).catch((err) => {});
    } 
    const [product_metal, setP_M] = useState([])
    const GetKeysMetalsProducts = async () => {
        await axios.post('http://localhost:8000/select', { columns: '*', tables: 'product_metal' })
        .then((req, res) => { setP_M(req.data.return); }).catch((err) => {});
    } 
    const GetSmithy = async () => {
        await axios.post('http://localhost:8000/select', { columns: '*', tables: 'smithy' })
        .then((req, res) => { setDataSmithy(req.data.return); }).catch((err) => {});
    }
    const Fetch = () => {
        FetchData();
        GetMetals();
        GetKeysMetalsProducts();
        GetSmithy();
    }
    useEffect(() => {
        Fetch();
    }, []);
    const loadClientFile = (e) => {
        e.preventDefault();
        const reader = new FileReader();
        const file = e.target.files ? e.target.files[0] : e.dataTransfer.files[0];
        // const file = e.target.files[0] || e.dataTransfer.files;
        if (file.size > 1024 * 1024 * 6) {
           // store.dispatch(messageChanger(true, 'Загрузка документа', 'Файл слищком большой'));
        } else if ((file.type === 'application/pdf') || (file.type === 'image/jpeg') || (file.type === 'image/jpg') || (file.type === 'image/png')) {
            reader.onloadend = () => {
                File = file;
                imagePreviewUrl = reader.result;
                setD(imagePreviewUrl);
               // SetText(File.name);
               // SetCheck(!check);
            };
        } else {
           // 
        }
       // reader.readAsBinaryString(file);
        reader.readAsDataURL(file);
    };
    const insertMetals = (idLast) => {
        for (let i = 0; i < metals.length; i++){
            let columnsT = 'id_product, id_metal';
            let val = `'${idLast}', '${metals[i]}'`;
            let data = {
                columns: columnsT,
                values: val,
            };
            axios.post('http://localhost:8000/insert', {data: data, tables: 'product_metal'})
            .then((req, res) => {setMetals([]); FetchData()}).catch((err) => {});
        }
    }
    const createNewProduct = () => {
        setModify(false);
        setOpen(!openState);
        let columnsT = 'image, cost, count, name, description, idsmithy';
        let val = `'${d}', '${cost}', '${count}', '${name}', '${descr}', '${smithy}'`;
        let data = {
            columns: columnsT,
            values: val,
        };
        if ((d !== '') && (cost !== '') && (count !== '') && (name !== '')){
            axios.post('http://localhost:8000/insert', { data: data, tables: 'product' })
                .then((req, res) => {
                        if (req.data.result === true){
                            axios.post('http://localhost:8000/select', { columns: '*', tables: 'product', cond: 'ORDER BY idproduct DESC LIMIT 1' })
                                .then((req, res) => {
                                    insertMetals(req.data.return[0].idproduct);
                                    Fetch();
                                    }
                                ).catch((err) => {});

                        }
                    }
                ).catch((err) => {});
        } else {

        }
    };
    const UpdateData = () => {
        setOpen(!openState);
        axios.post('http://localhost:8000/delete', { table: 'product_metal', where: `id_product=${id}` })
        let where = `idproduct = ${id}`;
        let values = `image = '${d}', cost = '${cost}', count = '${count}', name = '${name}', idsmithy = '${smithy}', description = '${descr}'`;

        axios.post('http://localhost:8000/update', { table: 'product', values: values, cond: where })
            .then(async (req, res) => {insertMetals(id); Fetch();}
            ).catch((err) => {
            console.log(err);
        });
    };
    const showNewProduct = (open) => {
        setModify(false);
        setOpen(!openState);
    };
    const clickOption= (id, i) => {
        let doc = document.getElementsByClassName(id);
        doc[i].classList.toggle('s');

    }
    const addMetal = (value) => {
        let temp = metals;
        let flag = false;
        if (temp.length === 0){
            temp.push(value);
        } else {
            for (let i = 0; i < temp.length; i++){
                if (temp[i] === value){
                    temp.splice(i, 1);
                    flag = false;
                    break
                } else {
                    flag = true;
                }
            }
            if (flag === true){
                temp.push(value);
            }
        }
        setMetals(temp);
    }
    const deleteProduct = (id) => {
        axios.post('http://localhost:8000/delete', { table: 'product', where: `idproduct=${id}` })
    }
    const edit = (ID, i) => {
        setMetals([]);
        setId(ID);
        setModify(true);
        setD(data[i].image);
        setName(data[i].name)
        setCost(data[i].cost);
        setCount(data[i].count);
        setDescr(data[i].description);
        setSmithy(data[i].idsmithy);
        setOpen(!openState);
    }

    const EachSetting = (data, i) => {
        return (
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
                    <button className="btn_main azure" onClick={() => edit(data.idproduct, i)}>Изменить</button>
                    <button className="btn_main azure" onClick={() => deleteProduct(data.idproduct)}>Удалить</button>
                </div>
            </div>
        </div>
        )
    }
    const [findTextState, setFindText] = useState('');
    const findtext = async (e) => {
        setFindText(e.target.value);
        await axios.post('http://localhost:8000/select', { columns: '*', tables: 'product', cond: `where UPPER(name) LIKE UPPER('%${e.target.value}%')` })
        .then((req, res) => { setData(req.data.return); }).catch((err) => {});
    }
    const Field = () => data && data.map(EachSetting);
    return (
            <div className="main_product">  
                <input style={{ display: 'none' }} className="FileInput" id="FileInputPasp" type="file" accept="image/png,image/jpeg,application/pdf" onChange={(e) => loadClientFile(e)} />
                {openState ? (
                    <div className="wrap">
                        <div className="newProduct form">
                            <div className="image_product_deck" style={{flexDirection: 'column', width: '250px', justifyContent: 'flex-start'}}>
                                <img src={d} alt="" />
                                <h5 className="h_form">Изображение</h5>
                                <div><button className="btn_main azure" onClick={() => document.getElementById('FileInputPasp').click()}>Выбрать</button></div>
                            </div>
                        <div style={{ display: 'grid' }}>
                            <div className="h_form">Название</div>
                            <input value={name} onChange={(e) => setName(e.target.value)}/>
                            <div className="h_form">Цена</div>
                            <input value={cost} onChange={(e) => setCost(e.target.value)}/>
                            <div className="h_form">Колличество</div>
                            <input value={count} onChange={(e) => setCount(e.target.value)}/>
                            <div className="h_form">Описание</div>
                            <input value={descr} onChange={(e) => setDescr(e.target.value)}/>
                            <div className="h_form">Использемые металлы</div>
                            <select className="selectProduct" multiple={true}  defaultValue={0} value={0} onChange={(event) => { addMetal(event.target.value) }} onBlur={null}>
                                {dataMetals.map((temp, i) => <option key={i} className="optionMetal" value={temp.idmetal || 0} onClick={() => clickOption('optionMetal', i)}>{temp.name || 'Нет данных'}</option>)}
                            </select>
                            <div className="h_form">Склад хранения</div>
                            <select className="selectProduct" defaultValue={smithy} value={smithy} onChange={(event) => setSmithy(event.target.value)} onBlur={null}>
                                <option key={-1} value={null}>Не выбрано</option>
                                {dataSmithy.map((temp, i) => <option key={i} value={temp.idsmithy || 0}>{temp.name_smithy || 'Нет данных'}</option>)}
                            </select>
                            <button disabled={(d && name && cost && count && smithy && descr && metals) ? false : true} className="btn_main" style={{marginTop: '15px'}} onClick={() => {modify === false ? createNewProduct() : UpdateData() }} >{modify === false ? 'Создать' : 'Сохранить'}</button>
                            <button className="btn_main" style={{marginTop: '15px'}} onClick={() => setOpen(false)} >Закрыть</button>
                        </div>
                        </div>
                    </div>
                ) : null}

                <div className="find_bar">
                    <div>
                        <h5>Поиск по названию</h5>
                        <input type="text" value={findTextState} onChange={findtext} />
                    </div>
                    <button className="btn_main azure" onClick={() => showNewProduct(true)} >Создать новый продукт</button>
                </div>
                {Field()}
            </div>
    );
};

export default withRouter(Products);
