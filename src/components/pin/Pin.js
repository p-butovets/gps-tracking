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

    const { status, deadline, address, number } = props.orderInfo;

    const colorClass = status == "ON_WAY" ? "green" : "gray"
    const badgeName = status.toLowerCase()

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