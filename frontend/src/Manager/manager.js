import React, { useState, useEffect } from "react";
import Contracts from './Contracts';
import NavBar from './NavBar';
import axios from 'axios';
import Products from '../products'
import Metal from '../metal';
import Delivery from '../delivery';
import Orders from '../order';
import {getId} from '../landing';


const Manager = (props) => {
    const [id, setId] = useState();
    const [showContracts, setShowContracts] = useState(true);
    const [showProducts, setShowProducts] = useState(false);
    const [showMetals, setShowMetals] = useState(false);
    const [showDelivery, setShowDelivery] = useState(false);
    const [showOrders, setShowOrders] = useState(false);
    const [products, setProducts] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [metals, setMetals] = useState([]);
    const [product_metal, setP_M] = useState([]);
    const fetchManagerUse = async () => {
        let id = getId();
          // let id = 71;
        setId(id);
        let res = await axios.post('http://localhost:8000/select', { columns: '*', tables: 'contract', cond: `left join deliverycompany on deliverycompany.idcompany = contract.delivery left join customer on contract.customer = customer.idcustomer where worker=${id} or worker is null` });
        setContracts(res.data.return);
    }
    useEffect(() => {
        const fetchManager = async () => {
            let id = getId();
           //let id = 71;
           setId(id)
            console.log(id)
            let res = await axios.post('http://localhost:8000/select', { columns: '*', tables: 'contract', cond: `left join deliverycompany on deliverycompany.idcompany = contract.delivery left join customer on contract.customer = customer.idcustomer where worker=${id} or worker is null` });
            setContracts(res.data.return);
        }
        fetchManager();
    }, [])
    const getProducts = async () => {
        let res = await axios.post('http://localhost:8000/select', { columns: '*', tables: 'product' })
        setProducts(res.data.return);
    }
    const openContracts = () => {
        setShowProducts(false);
        setShowMetals(false);
        setShowOrders(false);
        setShowDelivery(false);
        setShowContracts(true);
        fetchManagerUse();
    }
    const openProducts = () => {
        setShowMetals(false);
        setShowDelivery(false);
        setShowContracts(false);
        setShowOrders(false);
        setShowProducts(true);
        getProducts();
    }
    const openDelivery = () => {
        setShowProducts(false);
        setShowMetals(false);
        setShowContracts(false);
        setShowOrders(false);
        setShowDelivery(true);
    }
    const openMetals = () => {
        setShowProducts(false);
        setShowDelivery(false);
        setShowContracts(false);
        setShowOrders(false);
        setShowMetals(true);
    }
    const openOrders = () => {
        setShowProducts(false);
        setShowDelivery(false);
        setShowContracts(false);
        setShowMetals(false);
        setShowOrders(true);
    }
    return(
        <div>
            <NavBar openOrders={openOrders} openContracts={openContracts} openProducts={openProducts} openDelivery={openDelivery} openMetals={openMetals}/>
            {showContracts ? <Contracts id={id} fetchManagerUse={fetchManagerUse} contracts={contracts} /> : null}
            {showProducts? <Products products={products} product_metal={product_metal} metals={metals} /> : null}
            {showMetals ? <Metal /> : null}
            {showDelivery ? <Delivery /> : null}
            {showOrders ? <Orders id={id} />: null}

        </div>
    )
}

export default Manager;