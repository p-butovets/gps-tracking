import { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import IikoService from "../../services/iikoService";
import Pin from '../pin/Pin';

import './mapp.scss';

const Mapp = (props) => {

    const { couriers, visbleTerminal, token, actualOrders } = props;

    const [employees, setEmployees] = useState();

    const pins = [];

    const iikoservice = new IikoService();


    /*work with employees */

    const onEmployeesRefreshed = (employees) => {
        setEmployees(employees)
    }

    const refreshEmployees = (token) => {
        iikoservice.getCouriers(token).then(onEmployeesRefreshed);
    };

    useEffect(() => {
        if (token) {
            refreshEmployees(token);
        }
        // eslint-disable-next-line
    }, []);

    const getCourierById = (courierId) => {
        if (employees) {
            for (let i in employees) {
                if (employees[i].id === courierId) {
                    return [employees[i].displayName, employees[i].cellPhone]
                }
            }
        }
    };

    const getOrderById = (orderId) => {
        for (let i of actualOrders) {
            if (i.id === orderId) {
                return i
            }
        }
    }


    for (let i in couriers) {
        pins.push(
            <Pin
                key={i}
                courierId={i}
                latitude={couriers[i].latitude}
                longitude={couriers[i].longitude}
                orders={couriers[i].orders}
                terminal={couriers[i].terminal}
                visbleTerminal={visbleTerminal}
                getCourierById={getCourierById}
                getOrderById={getOrderById}
            />)
    }

    return (
        <>
            <MapContainer center={[50.4374731495035, 30.51346447588832]} zoom={11} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {pins}
            </MapContainer>
        </>
    )
}


export default Mapp;