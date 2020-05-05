import React, { useState } from 'react';
import {withRouter} from 'react-router-dom';
import Menu from './Main';
import Employers from './employes';
import Customers from './customers';
import Metal from './metal';
import Products from './products';
import Smithys from './smithys';
import Delivery from './delivery';
import Orders from './ordersAndContracts';
import ContractsAdmin from './ContractsAdmin';
import axios from 'axios';
import './App.scss'

const Admin = (props) => {
    const [open, setOpen] = useState([true, false, false, false, false, false, false, false]);
    const showWindow = (index) => {
        let temp = [...open];
        for(let i = 0; i < temp.length; i++){
            if (i === index){
                temp[i] = true;
            } else {
                temp[i] = false;
            }
        }
        setOpen(temp);
    }
    return (
      <>
        <Menu showWindow={showWindow}/>
        <div>
              {open[0] ? <Employers/> : null}
              {open[1] ? <Customers/> : null}
              {open[2] ? <Products/> : null}
              {open[3] ? <Smithys/> : null}
              {open[4] ? <Metal/> : null}
              {open[5] ? <Delivery/> : null}
              {open[6] ? <Orders/> : null}
              {open[7] ? <ContractsAdmin/> : null}
        </div>
      </>
    );
};

export default Admin;
