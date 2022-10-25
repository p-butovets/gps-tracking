import { Marker, Popup } from 'react-leaflet';
import './pin.scss';

const Pin = (props) => {

    const { orders, terminal, latitude, longitude, visbleTerminal, courierId, getCourierById, getOrderById } = props;

    const info = orders.map(orderId => {
        const orderInfo = getOrderById(orderId)
        return (
            <Order key={orderId} orderInfo={orderInfo} />
        )
    })


    return (
        <>
            {!visbleTerminal ?
                <Marker position={[latitude, longitude]}>
                    <Popup>
                        <div className='courier__name'>{getCourierById(courierId)}</div>
                        {info}
                    </Popup>
                </Marker>
                :
                null
            }

            {terminal === visbleTerminal ?
                <Marker position={[latitude, longitude]}>
                    <Popup>
                        <div className='courier__name'>{getCourierById(courierId)}</div>
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

    const orderInfo = props.orderInfo;

    return (
        <>
            <div className="courier__order">
                <div>Номер: <span className="courier__order-number">{orderInfo.number}</span></div>
                <div>Адрес: {orderInfo.address}</div>
                <div>Дедлайн: {orderInfo.deadline}</div>
            </div>
        </>

    )
}

export default Pin;