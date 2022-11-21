import { useState, useEffect } from 'react';
import DashboardItem from '../dashboardItem/DashboardItem';
import './ordersList.scss';

const OrdersList = (props) => {

    const orders = props.allOrders;

    // const [workload, setWorkload] = useState(null);
    const [totalCounter, setTotalCounter] = useState(null);
    const [couriersOrders, setCouriersOrders] = useState(null);
    const [pickupOrders, setPickupOrders] = useState(null);

    /*когда обновляется orders, для каждой кухни считаем количество
    заказов в статусах "новая" и "готовится". Это текущая нагрузка на кухни */
    useEffect(() => {
        /*1. Устанавливаем "всего заказов" */
        setTotalCounter(orders.length)
        /*2. Сбрасываем счетчики */
        setPickupOrders(0)
        setCouriersOrders(0)

        /*3. набираем счетчики*/
        for (let i in orders) {
            console.log(orders[i].type)
            switch (orders[i].type) {
                case 'DELIVERY_PICKUP':
                    setPickupOrders(pickupOrders => pickupOrders += 1)
                    break
                case 'DELIVERY_BY_COURIER':
                    setCouriersOrders(couriersOrders => couriersOrders += 1)
                    break
            }
        }

    }, [orders])


    return (
        <section>
            <div className="dashboard">
                <DashboardItem title="Всього замовлень" value={totalCounter} />
                <DashboardItem title="Агрегатори та самовивіз" value={pickupOrders} />
                <DashboardItem title="Доставка кур'єром" value={couriersOrders} />
            </div>
            <div className="o-list-filter"></div>
        </section>
    )
}

export default OrdersList;