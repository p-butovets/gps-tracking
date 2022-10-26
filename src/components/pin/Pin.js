import { useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import * as ReactDOMServer from 'react-dom/server';
import { divIcon } from 'leaflet';
import L from "leaflet";
import CustomMarker from '../customMarker/CustomMarker';
import RoutingMachine from '../routingMachine/RoutingMachine';
import './pin.scss';

const Pin = (props) => {

    const { orders, terminal, latitude, longitude, visbleTerminal, courierId, getCourierById, getOrderById } = props;

    const [showRoute, setShowRoute] = useState(false);

    const [name, phone] = getCourierById(courierId);

    //Список заказов курьера для модалки
    const info = orders.length > 0 ?
        orders.map(orderId => {
            const orderInfo = getOrderById(orderId)
            return (
                <Order key={orderId} orderInfo={orderInfo} />
            )
        })
        :
        <div className='courier__order'>Свободен</div>

    /*Формируем маршрут */

    //из каждого заказа курьера берем координаты адреса доставки
    // и делем waypoints для маршрута по заказам
    const waypoints = orders.map(orderId => {
        const { orderLocationInfo } = getOrderById(orderId)
        return (
            L.latLng(orderLocationInfo.latitude, orderLocationInfo.longitude)
        )
    })
    //добавляем первую точку - текущие координаты курьера из пропсов
    waypoints.unshift(L.latLng(latitude, longitude))

    //добавляем последнюю точку base location
    waypoints.push(L.latLng(terminal.lat, terminal.long))

    return (
        <>
            {!visbleTerminal ?
                <Marker
                    icon={divIcon({
                        className: "custom icon", html: ReactDOMServer.renderToString(
                            <CustomMarker
                                status={orders.length > 0 ? "onway" : "free"}
                            />)
                    })}
                    position={[latitude, longitude]}>
                    <Popup showRoute={showRoute} setShowRoute={setShowRoute}>
                        <div className='courier__name'>{name}</div>
                        <div className='courier__phone'>{phone}</div>
                        {info}
                        <div
                            onClick={() => setShowRoute(!showRoute)}
                            className="courier__route-toggler">
                            {showRoute ? 'выкл маршрут' : 'вкл маршрут'}
                        </div>
                    </Popup>

                    {showRoute ?
                        <RoutingMachine waypoints={waypoints} />
                        :
                        null
                    }

                </Marker>
                :
                null
            }

            {terminal.id === visbleTerminal ?
                <Marker
                    icon={divIcon({
                        className: "custom icon", html: ReactDOMServer.renderToString(
                            <CustomMarker
                                status={orders.length > 0 ? "onway" : "free"}
                            />)
                    })}
                    position={[latitude, longitude]}>
                    <Popup showRoute={showRoute} setShowRoute={setShowRoute}>
                        <div className='courier__name'>{name}</div>
                        <div className='courier__phone'>{phone}</div>
                        {info}
                        <div
                            onClick={() => setShowRoute(!showRoute)}
                            className="courier__route-toggler">
                            {showRoute ? 'выкл маршрут' : 'вкл маршрут'}
                        </div>
                    </Popup>

                    {showRoute ?
                        <RoutingMachine waypoints={waypoints} />
                        :
                        null
                    }

                </Marker>
                :
                null
            }
        </>
    )
}


const Order = (props) => {

    const { status, deadline, address, number } = props.orderInfo;

    const colorClass = status === "ON_WAY" ? "green" : "gray"
    const badgeName = status.toLowerCase();

    return (
        <>
            <div className={`courier__order ${colorClass}`}>
                <div className={`courier__order-badge ${colorClass}`}>{badgeName}</div>
                <div>Номер: <span className="courier__order-number">{number}</span></div>
                <div>Адрес: {address}</div>
                <div>Дедлайн: {deadline}</div>
            </div>
        </>

    )
}

export default Pin;