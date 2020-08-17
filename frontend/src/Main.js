import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import './style/Main.scss'
import axios from 'axios';

const showHistoryMap = (data, all, i) => {
        return (
            <div key={i} className="allHistoryAdmin">
                <div>{data.time_work.substr(10,9).replace('T', ' ')}</div>
                <div>{data.data1 ? data.data1.substr(0, 40) : null}</div>
                <div>{data.data2 ? data.data2.substr(0, 40) : null}</div>
                <div>{data.data5}</div>
                <div>{data.data7}</div>
            </div>
        )
};

const Menu = (props) => {
    const [openState, setOpen] = useState(false);
    const [allState, setAllState] = useState(true);
    const [data, setData] = useState([]);
    // cond: ''
    const getHistory = async () => {
        await axios.post('http://localhost:8000/select', { columns: '*', tables: 'work_log' })
            .then((req, res) => {
                    setData(req.data.return);
                }
            ).catch((err) => {});
    };
    useEffect(() => {
       // getHistory();
       let g = setInterval(getHistory, 2000);
       return () => clearInterval(g);
    }, []);
    const showHistory = (all) => {
        getHistory();
        console.log(data);
        all === true ? setAllState(true) : setAllState(false);
        setOpen(!openState);
    };
    const EachSetting = (data, i) => (
        <>
            {showHistoryMap(data, allState, i)}
        </>
    );
    const getNewId = (dataString) => {
        let colNumber = 0;
        for (let i = 0; i < dataString.length; i++){
            if (dataString[i] === ','){
                console.log(dataString[i]);
                break;
            } else {
                console.log(dataString[i]);
                colNumber++;
            }
        }
        return colNumber
    };
    const undo = async () => {
        let Method = data[data.length-1].data5;
        let colNumber = Method === 'DELETE' ? await getNewId(data[data.length-1].data2) : await getNewId(data[data.length-1].data1);
        let lastUpdate = data[data.length-1].data1 === null ? '' : data[data.length-1].data1.substr(1,colNumber-1);
        let Table = data[data.length-1].data7;
        let columns = null;
        await axios.post('http://localhost:8000/select', { columns: 'column_name', tables: 'information_schema.columns', cond: `where table_schema='public' and table_name='${Table}'` })
            .then((req, res) => {
               columns = req.data.return}).catch((err) => {console.log(err);});
        let columnsArray = '';
        for (let i = 0; i < columns.length; i++){
            columnsArray += `${columns[i].column_name}, `;
        }
        columnsArray = columnsArray.substring(0, columnsArray.length-2);
        let dataforinsert = data[data.length-1].data2 ? data[data.length-1].data2.replace(/""/gi, `''`).replace('(', '').replace(')', '') : '';
        let newData = data[data.length-1].data1 ? data[data.length-1].data1.replace(/""/gi, `''`).replace('(', '').replace(')', '') : '';
        let f = '';
            let arrayOldData = dataforinsert.split(',');
        arrayOldData.map((data, i) => {
                if (data.match(/[a-z, а-я, /.<>"'!@#$%^&*()=_+*(/)`~/]/gi)){
                    f+= `'${data}',`;
                } else {
                    if (data.match(/[0-9]/)) {
                    f+= `${data},`;
                    }
                }
            });
        let dataTempOld = {
            values: f.substring(0, f.length-1),
            columns: columnsArray,
        };
        switch (Method) {
            case 'INSERT':
                axios.post('http://localhost:8000/delete', { table: Table, where: `${columns[0].column_name}=${lastUpdate}` })
                    .then(async (req, res) => {
                            if (req.data.result === true){
                                await axios.post('http://localhost:8000/delete', { table: 'work_log', where: `idlog=(select max(idlog) from work_log)` });
                                axios.post('http://localhost:8000/delete', { table: 'work_log', where: `idlog=(select max(idlog) from work_log)` });
                            }
                        }
                    ).catch((err) => {
                    console.log(err);
                });
                break;
            case 'DELETE':
                axios.post('http://localhost:8000/insert', { tables: Table, data: dataTempOld })
                    .then(async (req, res) => {
                            if (req.data.result === true){
                                await axios.post('http://localhost:8000/delete', { table: 'work_log', where: `idlog=(select max(idlog) from work_log)` });
                                axios.post('http://localhost:8000/delete', { table: 'work_log', where: `idlog=(select max(idlog) from work_log)` });
                            }
                        }
                    ).catch((err) => {
                    console.log(err);
                });
                break;
            case 'UPDATE':
                    let where = `${columns[0].column_name}=${lastUpdate}`;
                    let values = '';
                let arrayNewData = newData.split(',');
                for (let i = 1; i < columns.length; i++){
                    values += `${columns[i].column_name} = '${arrayOldData[i]}', `;
                }
                console.log(values)
                values = values.substr(0, values.length-2)
                    axios.post('http://localhost:8000/update', { table: Table, values: values, cond: where })
                        .then(async (req, res) => {
                                if (req.data.result === true){
                                    await axios.post('http://localhost:8000/delete', { table: 'work_log', where: `idlog=(select max(idlog) from work_log)` });
                                    axios.post('http://localhost:8000/delete', { table: 'work_log', where: `idlog=(select max(idlog) from work_log)` });
                                }
                        }
                        ).catch((err) => {
                        console.log(err);
                    });
                break;
            default:
                alert( "Нет таких значений" );
        }
    }
    const setDumpBd = () => {
        axios.post('http://localhost:8000/setdump').then(async (req, res) => {console.log(req.data)}).catch((err) => {
            console.log(err);
        })
    }
    const getDumBd = async () => {
        await axios.post('http://localhost:8000/getdump').then(async (req, res) => {console.log(req.data)}).catch((err) => {
            console.log(err);
        })
    }
    const Field = () => data && data.map(EachSetting);
    return (
        <>
            <div className="mainMenu">
                <button className="btn_main" onClick={() => props.showWindow(0)}>Сотрудники</button>
                <button className="btn_main" onClick={() => props.showWindow(1)}>Заказчики</button>
                <button className="btn_main" onClick={() => props.showWindow(2)}>Продукция</button>
                <button className="btn_main" onClick={() => props.showWindow(3)}>Кузницы</button>
                <button className="btn_main" onClick={() => props.showWindow(4)}>Металлы</button>
                <button className="btn_main" onClick={() => props.showWindow(5)}>Доставщики</button>
                <button className="btn_main" onClick={() => props.showWindow(6)}>Заказы</button>
                <button className="btn_main" onClick={() => props.showWindow(7)}>Договора</button>
                <button className="btn_main" style={{minWidth: '50px', padding: '0'}} onClick={() => showHistory(false)}>
                    <svg className="history_icon" viewBox="0 0 512 512" width="30" height="30" xmlns="http://www.w3.org/2000/svg"><path d="m32 456c.025 22.081 17.919 39.975 40 40h296c61.851.006 111.996-50.129 112.002-111.98.004-43.264-24.912-82.66-64.002-101.199v-162.821c0-2.122-.843-4.157-2.343-5.657l-96-96c-1.5-1.5-3.535-2.343-5.657-2.343h-240c-22.081.025-39.975 17.919-40 40zm432-72c0 53.019-42.981 96-96 96s-96-42.981-96-96 42.981-96 96-96c52.995.06 95.94 43.005 96 96zm-144-340.687 68.687 68.687h-44.687c-13.249-.015-23.985-10.751-24-24zm-272 12.687c.015-13.248 10.752-23.985 24-24h232v56c.025 22.081 17.919 39.975 40 40h56v148.666c-59.265-17.683-121.643 16.025-139.327 75.289-14.627 49.023 5.828 101.725 49.696 128.045h-238.369c-13.248-.015-23.985-10.752-24-24z"/><path d="m160 168c0 4.418 3.582 8 8 8h192c4.418 0 8-3.582 8-8s-3.582-8-8-8h-192c-4.418 0-8 3.582-8 8z"/><path d="m88 224h160c4.418 0 8-3.582 8-8s-3.582-8-8-8h-160c-4.418 0-8 3.582-8 8s3.582 8 8 8z"/><path d="m280 256h-64c-4.418 0-8 3.582-8 8s3.582 8 8 8h64c4.418 0 8-3.582 8-8s-3.582-8-8-8z"/><path d="m88 320h144c4.418 0 8-3.582 8-8s-3.582-8-8-8h-144c-4.418 0-8 3.582-8 8s3.582 8 8 8z"/><path d="m88 176h48c4.418 0 8-3.582 8-8s-3.582-8-8-8h-48c-4.418 0-8 3.582-8 8s3.582 8 8 8z"/><path d="m360 208h-80c-4.418 0-8 3.582-8 8s3.582 8 8 8h80c4.418 0 8-3.582 8-8s-3.582-8-8-8z"/><path d="m88 272h96c4.418 0 8-3.582 8-8s-3.582-8-8-8h-96c-4.418 0-8 3.582-8 8s3.582 8 8 8z"/><path d="m216 400h-32c-4.418 0-8 3.582-8 8s3.582 8 8 8h32c4.418 0 8-3.582 8-8s-3.582-8-8-8z"/><path d="m88 416h64c4.418 0 8-3.582 8-8s-3.582-8-8-8h-64c-4.418 0-8 3.582-8 8s3.582 8 8 8z"/><path d="m88 368h48c4.418 0 8-3.582 8-8s-3.582-8-8-8h-48c-4.418 0-8 3.582-8 8s3.582 8 8 8z"/><path d="m88 128h96c4.418 0 8-3.582 8-8s-3.582-8-8-8h-96c-4.418 0-8 3.582-8 8s3.582 8 8 8z"/><path d="m216 352h-48c-4.418 0-8 3.582-8 8s3.582 8 8 8h48c4.418 0 8-3.582 8-8s-3.582-8-8-8z"/><path d="m322.879 329.854c-3.395 2.828-3.854 7.873-1.026 11.267 0 0 0 .001.001.001 0 0 30.333 36.449 39.97 47.964.971 1.161 2.556 2.512 5.331 2.87.28.036.563.044.845.044h56c4.418 0 8-3.582 8-8s-3.582-8-8-8h-52.253l-37.6-45.122c-2.828-3.394-7.873-3.853-11.268-1.024z"/></svg>
                </button>
                <button className="btn_main" style={{minWidth: '50px', padding: '0'}} onClick={setDumpBd}>
                            <svg    xmlns="http://www.w3.org/2000/svg" 
                                    width="24" height="24"
                                    viewBox="0 0 512 512"
                                    >
                                        <path style={{fill: '#ffffff'}} d="M469.333,304.232V74.667C469.333,25.646,351.271,0,234.667,0S0,25.646,0,74.667v320
                                            c0,49.021,118.063,74.667,234.667,74.667c22.587,0,45.138-1.119,67.246-3.081C323.392,494.017,356.935,512,394.667,512
                                            C459.354,512,512,459.365,512,394.667C512,358.313,495.374,325.77,469.333,304.232z M234.667,21.333
                                            C364.896,21.333,448,52.917,448,74.667S364.896,128,234.667,128S21.333,96.417,21.333,74.667S104.438,21.333,234.667,21.333z
                                            M21.333,107.681c39.163,27.44,126.607,41.652,213.333,41.652S408.837,135.121,448,107.681v73.652
                                            c0,21.75-83.104,53.333-213.333,53.333S21.333,203.083,21.333,181.333V107.681z M234.667,448
                                            c-130.229,0-213.333-31.583-213.333-53.333v-73.652c39.163,27.44,126.607,41.652,213.333,41.652
                                            c16.145,0,32.016-0.645,47.63-1.604c-3.194,10.656-4.964,21.923-4.964,33.604c0,18.342,4.352,35.647,11.889,51.125
                                            C271.199,447.121,252.973,448,234.667,448z M234.667,341.333c-130.229,0-213.333-31.583-213.333-53.333v-73.652
                                            C60.496,241.788,147.94,256,234.667,256S408.837,241.788,448,214.348v75.94c-16.023-8.223-34.121-12.954-53.333-12.954
                                            c-44.611,0-83.477,25.042-103.316,61.799C272.945,340.529,253.967,341.333,234.667,341.333z M394.667,490.667
                                            c-52.938,0-96-43.063-96-96s43.063-96,96-96s96,43.063,96,96S447.604,490.667,394.667,490.667z"/>
                                        <path style={{fill: '#ffffff'}} d="M402.208,323.125c-4.167-4.167-10.917-4.167-15.083,0l-42.667,42.667c-4.167,4.167-4.167,10.917,0,15.083
                                            c4.167,4.167,10.917,4.167,15.083,0L384,356.417v102.25c0,5.896,4.771,10.667,10.667,10.667s10.667-4.771,10.667-10.667v-102.25
                                            l24.458,24.458c2.083,2.083,4.813,3.125,7.542,3.125c2.729,0,5.458-1.042,7.542-3.125c4.167-4.167,4.167-10.917,0-15.083
                                            L402.208,323.125z"/>
                            </svg>
                </button>
                <button className="btn_main" style={{minWidth: '50px', padding: '0'}} onClick={getDumBd}>
                            <svg    xmlns="http://www.w3.org/2000/svg" 
                                    width="24" height="24"
                                    viewBox="0 0 512 512"
                                    style={{transform: 'rotate(180deg)'}}
                                    >
                                        <path style={{fill: '#ffffff'}} d="M469.333,304.232V74.667C469.333,25.646,351.271,0,234.667,0S0,25.646,0,74.667v320
                                            c0,49.021,118.063,74.667,234.667,74.667c22.587,0,45.138-1.119,67.246-3.081C323.392,494.017,356.935,512,394.667,512
                                            C459.354,512,512,459.365,512,394.667C512,358.313,495.374,325.77,469.333,304.232z M234.667,21.333
                                            C364.896,21.333,448,52.917,448,74.667S364.896,128,234.667,128S21.333,96.417,21.333,74.667S104.438,21.333,234.667,21.333z
                                            M21.333,107.681c39.163,27.44,126.607,41.652,213.333,41.652S408.837,135.121,448,107.681v73.652
                                            c0,21.75-83.104,53.333-213.333,53.333S21.333,203.083,21.333,181.333V107.681z M234.667,448
                                            c-130.229,0-213.333-31.583-213.333-53.333v-73.652c39.163,27.44,126.607,41.652,213.333,41.652
                                            c16.145,0,32.016-0.645,47.63-1.604c-3.194,10.656-4.964,21.923-4.964,33.604c0,18.342,4.352,35.647,11.889,51.125
                                            C271.199,447.121,252.973,448,234.667,448z M234.667,341.333c-130.229,0-213.333-31.583-213.333-53.333v-73.652
                                            C60.496,241.788,147.94,256,234.667,256S408.837,241.788,448,214.348v75.94c-16.023-8.223-34.121-12.954-53.333-12.954
                                            c-44.611,0-83.477,25.042-103.316,61.799C272.945,340.529,253.967,341.333,234.667,341.333z M394.667,490.667
                                            c-52.938,0-96-43.063-96-96s43.063-96,96-96s96,43.063,96,96S447.604,490.667,394.667,490.667z"/>
                                        <path style={{fill: '#ffffff'}} d="M402.208,323.125c-4.167-4.167-10.917-4.167-15.083,0l-42.667,42.667c-4.167,4.167-4.167,10.917,0,15.083
                                            c4.167,4.167,10.917,4.167,15.083,0L384,356.417v102.25c0,5.896,4.771,10.667,10.667,10.667s10.667-4.771,10.667-10.667v-102.25
                                            l24.458,24.458c2.083,2.083,4.813,3.125,7.542,3.125c2.729,0,5.458-1.042,7.542-3.125c4.167-4.167,4.167-10.917,0-15.083
                                            L402.208,323.125z"/>
                            </svg>
                </button>
                <button className="btn_main" onClick={() => document.location.href = '/'}>Выйти</button>
            </div>
            <div style={{ display: openState === true ? 'block' : 'none' }} className="history">
                {allState ? (
                    <div className="allHistory">
                        <div>Пользователь</div>
                        <div>Время</div>
                        <div>Новые данные</div>
                        <div>Старые данные</div>
                        <div>Метод</div>
                        <div>Таблица</div>
                    </div>
                ) : (
                    <div className="allHistoryAdminInfo">
                        <div>Время</div>
                        <div>Новые данные</div>
                        <div>Старые данные</div>
                        <div>Метод</div>
                        <div>Таблица</div>
                        <button className="btn_main" onClick={() => undo()}>Отменить</button>
                        <button className="btn_main" onClick={() => { axios.post('http://localhost:8000/delete', { table: 'work_log', where: '' })}}>Очистить</button>
                    </div>
                )}
                <div className="dataHistory">
                    {Field()}
                </div>
                </div>
        </>
    );
};

export default Menu;
