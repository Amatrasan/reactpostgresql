import React, {useState, useRef, useEffect} from 'react';
import axios from 'axios';
import './style/all.scss';
import './style/addContract.scss';


const AddContract = (props) => {
    const File = useRef();
    const imagePreviewUrl = useRef();
    const [image, setImage] = useState();
    const [delivery, setDelivery] = useState([]);
    const loadClientFile = (e) => {
        e.preventDefault();
        const reader = new FileReader();
        const file = e.target.files ? e.target.files[0] : e.dataTransfer.files[0];
        if (file.size > 1024 * 1024 * 6) {
        } else if ((file.type === 'application/pdf') || (file.type === 'image/jpeg') || (file.type === 'image/jpg') || (file.type === 'image/png')) {
            reader.onloadend = () => {
                File.current = file;
                imagePreviewUrl.current = reader.result;
                setImage(imagePreviewUrl.current);
            };
        } else {
        }
        reader.readAsDataURL(file);
    };
    const getDelivery = () => {
        axios.post('http://localhost:8000/select', { columns: '*', tables: 'deliverycompany' })
        .then((req, res) => { 
            setDelivery(req.data.return)
        }).catch((err) => {});
    }

    useEffect(getDelivery, []);
    const [acceptDel, setAcceptDel] = useState();
    const [description, setDescription] = useState();
    const dateStart = useRef();


    const dateEnd = useRef();
    const send = async () => {
        let columnsT = 'startdate, enddate, image, customer, delivery, description';
        let val = `'${dateStart.current.value}', '${dateEnd.current.value}', '${imagePreviewUrl.current}', '${props.idAuthUser}', '${acceptDel}', '${description}'`;
        let data = {
            columns: columnsT,
            values: val,
        };
        await axios.post('http://localhost:8000/insert', { data: data, tables: 'contract' }).then(() => props.setAddContract(false))
    }
    return(
        <div className="contract form">
            <div className="">
                <img src={image} alt='' />
            </div>
            <div>
                <div className="flex_row date_contract">
                    <div>
                        <div className="h_form">Дата начала работ</div>
                        <input ref={dateStart} type="date" placeholder="Начало"/>
                    </div>
                    <div>
                        <div className="h_form">Дата окончания</div>
                        <input ref={dateEnd} type="date" placeholder="Конец"/>
                    </div>
                </div>
                <div className="h_form">Описание заказа</div>
                <textarea value={description} onChange={(e) => setDescription(e.target.value) }/>
                <div className="flex_row contract_delivery">
                    <div className="h_form">Фирма доставки</div>
                    <select className="delivery_list" value={acceptDel} onChange={(e) => setAcceptDel(e.target.value)}>
                        <option value={0}>Не выбрано</option>
                        {delivery.map((data, i) => <option key={i} value={data.idcompany}>{data.name}</option>)}
                    </select>
                </div>

                <div className="flex_row">
                    <button className="btn_main" onClick={() => document.getElementById('FileInputC').click()}>Загрузить макет</button>
                    <button disabled={(dateStart.current && dateEnd.current && acceptDel && image && description) ? false : true} className="btn_main" onClick={send}>Отправить</button>
                    <button className="btn_main" onClick={() => props.setAddContract(false)}>Закрыть</button>
                
                </div>
            </div>
            <input style={{ display: 'none' }} className="FileInput" id="FileInputC" type="file" accept="image/png,image/jpeg,application/pdf" onChange={(e) => loadClientFile(e)} />

        </div>
    )
}

export default AddContract;