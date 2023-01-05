import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import IikoService from "../../services/iikoService";
import Pin from '../pin/Pin';

import './mapp.scss';

const Mapp = (props) => {

    const { couriers, visbleTerminal, token, actualOrders } = props;

    const [employees, setEmployees] = useState();

    /*по дефолту центр карты по Киеву */
    const [mapCenter, setMapCenter] = useState([50.4374731495035, 30.51346447588832]);

    const pins = [];

    const iikoservice = new IikoService();

    /*work with employees */

    const onEmployeesRefreshed = (employees) => {
        setEmployees(employees)
    }

    const refreshEmployees = (token) => {
        iikoservice.getCouriers(token).then(onEmployeesRefreshed);
    };

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

    /* меняет центр карты 
    Берем айди активного терминала
    если null, то центр по киеву
    иначе 
    берем координаты терминала по айди из terminalsLocationData
    устанавливаем в mapCenter */

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

    useEffect(() => {
        if (token) {
            refreshEmployees(token);
        }
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <div onClick={() => setMapCenter([49.8327787, 23.9421961])}>111</div>
            <MapContainer scrollWheelZoom={true}>
                <ChangeView center={mapCenter} zoom={11} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {pins}
            </MapContainer>
        </>
    )
}

/*компонент для смены вида карты
только через него можно сменить центр карты*/
const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

export default Mapp;