import { Marker, Popup } from 'react-leaflet'
import './pin.scss';

const Pin = (props) => {

    const { order, visbleTerminal, getCourierById } = props;
    const location = order.courier.location


    return (
        <>
            {!visbleTerminal ?
                <Marker position={[location.latitude, location.longitude]}>
                    <Info order={order} getCourierById={getCourierById} />
                </Marker>
                :
                null
            }

            {order.deliveryTerminalId === visbleTerminal ?
                <Marker position={[location.latitude, location.longitude]}>
                    <Info order={order} getCourierById={getCourierById} />
                </Marker>
                :
                null
            }
        </>
    )
}

const Info = (props) => {

    const { order, getCourierById } = props;

    return (
        <>
            {
                order.status !== "DELIVERED" &&
                    order.status !== "CLOSED"
                    ?
                    <Popup>
                        <div>{getCourierById(order.courier.courierId)}</div>
                        <div>Номер заказа:{order.number}</div>
                        <div>Адрес доставки:{order.address}</div>
                    </Popup>
                    :
                    <Popup>
                        <div>{getCourierById(order.courier.courierId)}</div>
                    </Popup>
            }
        </>
    )
}
export default Pin;