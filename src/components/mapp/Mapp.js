import { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet'
import Pin from '../pin/Pin';
import IikoService from "../../services/iikoService";

import './mapp.scss';

const Mapp = (props) => {

    const { orders, visbleTerminal, token } = props;

    /* храним список всех курьеров организации*/
    const [couriers, setCouriers] = useState(null);

    const iikoservice = new IikoService();


    /*work with Couriers */
    const onCouriersRefreshed = (couriers) => setCouriers(couriers)

    const refreshCouriers = (token) => {
        iikoservice.getCouriers(token).then(onCouriersRefreshed);
    };

    const getCourierById = (id) => {
        if (couriers) {
            for (let i of couriers) {
                if (i.id === id) {
                    return i.displayName;
                }
            }
        }
    };

    useEffect(() => {
        if (token) {
            refreshCouriers(token);
        }
        // eslint-disable-next-line
    }, []);


    /*формируем булавки - маркер плюс попап */
    const pins = orders ?
        // eslint-disable-next-line
        orders.map(order => {
            if (order) {
                return (
                    <Pin
                        key={order.id}
                        order={order}
                        visbleTerminal={visbleTerminal}
                        getCourierById={getCourierById}
                    />
                )
            }
        })
        :
        null


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