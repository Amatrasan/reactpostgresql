import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Order from './order';
import axios from 'axios';
const Orders = () => {
    useEffect(() => {
        const FetchData = async () => {
            await axios.post('http://localhost:8000/select', { columns: '*', tables: 'orderproduct' })
                .then((req, res) => {
                        console.log(req);
                    }
                ).catch((err) => {});
            await axios.post('http://localhost:8000/select', { columns: '*', tables: 'contract' })
                .then((req, res) => {
                        console.log(req);
                    }
                ).catch((err) => {});
        }
        FetchData();
    }, []);
    return (
        <>
            <Order admin={true} />
        </>
    );
};

export default withRouter(Orders);
