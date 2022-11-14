import Badge from '../badge/Badge';
import './orderBlock.scss';

const OrderBlock = (props) => {
    const { status, deadline, address, number } = props.orderInfo;

    return (
        <li>
            <Badge status={status} />
            <div className="order">
                <div className="time">{deadline.slice(0, -3)}</div>
                <div className="order-address">{address}</div>
                <div className="order-number">{number}</div>
            </div>
        </li>
    )
}

export default OrderBlock;