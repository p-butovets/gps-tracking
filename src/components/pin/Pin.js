import { useState, useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';
import * as ReactDOMServer from 'react-dom/server';
import { divIcon } from 'leaflet';
import L from "leaflet";
import CustomMarker from '../customMarker/CustomMarker';
import RoutingMachine from '../routingMachine/RoutingMachine';
import OrderBlock from '../orderBlock/OrderBlock';
import './pin.scss';

const Pin = (props) => {

    const { orders, terminal, latitude, longitude, visbleTerminal, courierId, getCourierById, getOrderById } = props;

    //видимость маршрута
    const [showRoute, setShowRoute] = useState(false);

    //точки маршрута
    const [waypoints, setWayPoints] = useState([]);

    //Заголовки попапа
    const [name, setName] = useState(null);
    const [phone, setPhone] = useState(null);

    //список заказов курьера
    const [content, setContent] = useState(null);

    const setPopupContent = () => {
        //Список заказов курьера для модалки
        const ordersList = orders.length > 0 ?
            orders.map(orderId => {
                const orderInfo = getOrderById(orderId)
                return (
                    <OrderBlock key={orderId} orderInfo={orderInfo} />
                )
            })
            :
            <p>Вільний</p>
        setContent(ordersList)

        /*Формируем маршрут */
        // 1. из каждого заказа курьера берем координаты адреса доставки => массив
        const points = orders.map(orderId => {
            const { orderLocationInfo } = getOrderById(orderId)
            return (
                L.latLng(orderLocationInfo.latitude, orderLocationInfo.longitude)
            )
        })

        //2. добавляем первую точку - текущие координаты курьера из пропсов
        points.unshift(L.latLng(latitude, longitude))
        // !!! устанавливаем в стейт
        setWayPoints(points)

        //3. Обновляем waypoints - добавляем последнюю точку base location, если курьер свободен, значит едет на кухню
        if (!orders.length > 0) {
            setWayPoints(waypoints => ([...waypoints, L.latLng(terminal.lat, terminal.long)]))
        }
    }

    /*при рендере компонента*/
    useEffect(() => {

        /*ставим заголовки*/
        const [name, phone] = getCourierById(courierId);
        setName(name);
        setPhone(phone);

        /*ставим контент*/
        setPopupContent();

    }, [])

    /*когда обновился пропс orders */
    useEffect(() => {
        /*ставим новый контент*/
        setPopupContent();
    }, [orders])

    return (
        <>
            {!visbleTerminal || terminal.id === visbleTerminal ?
                <Marker
                    icon={divIcon({
                        className: "custom icon",
                        iconAnchor: [13, 37],
                        popupAnchor: [0, -21],
                        html: ReactDOMServer.renderToString(
                            <CustomMarker
                                status={orders.length > 0 ? "onway" : "free"}
                            />)
                    })}
                    position={[latitude, longitude]}>
                    <Popup>
                        <div className='courier__name'>{name}</div>
                        <div className='courier__phone'>{phone}</div>
                        <ul className="sessions">
                            {content}
                        </ul>
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


export default Pin;