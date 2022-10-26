import { Marker, Popup } from 'react-leaflet';
import * as ReactDOMServer from 'react-dom/server';
import { divIcon } from 'leaflet';
import CustomMarker from '../customMarker/CustomMarker';
import './pin.scss';

const Pin = (props) => {

    const { orders, terminal, latitude, longitude, visbleTerminal, courierId, getCourierById, getOrderById } = props;


    const info = orders.length > 0 ?
        orders.map(orderId => {
            const orderInfo = getOrderById(orderId)
            return (
                <Order key={orderId} orderInfo={orderInfo} />
            )
        })
        :
        <div className='courier__order green'>Свободен</div>

    const [name, phone] = getCourierById(courierId);

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
                    <Popup>
                        <div className='courier__name'>{name}</div>
                        <div className='courier__phone'>{phone}</div>
                        {info}
                    </Popup>
                </Marker>
                :
                null
            }

            {terminal === visbleTerminal ?
                <Marker
                    icon={divIcon({
                        className: "custom icon", html: ReactDOMServer.renderToString(
                            <CustomMarker
                                status={orders.length > 0 ? "onway" : "free"}
                            />)
                    })}
                    position={[latitude, longitude]}>
                    <Popup>
                        <div className='courier__name'>{name}</div>
                        <div className='courier__phone'>{phone}</div>
                        {info}
                    </Popup>
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