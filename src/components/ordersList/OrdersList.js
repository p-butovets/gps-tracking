import { useState, useEffect } from 'react';
import Order from '../order/Order';
import DashboardItem from '../dashboardItem/DashboardItem';
import IikoService from "../../services/iikoService";
import './ordersList.scss';

const OrdersList = (props) => {

    const iikoservice = new IikoService();
    const orders = props.allOrders;
    const token = props.token;

    const [employees, setEmployees] = useState();
    // const [workload, setWorkload] = useState(null);
    const [totalCounter, setTotalCounter] = useState(null);
    const [couriersOrders, setCouriersOrders] = useState(null);
    const [pickupOrders, setPickupOrders] = useState(null);

    /*work with employees */

    const onEmployeesRefreshed = (employees) => {
        setEmployees(employees)
    }

    const refreshEmployees = (token) => {
        iikoservice.getCouriers(token).then(onEmployeesRefreshed);
    };


    /*create list of orders */
    const list = orders.map((order, i) => {

        if (order.status !== 'Не подтверждена'
            &&
            order.status !== 'Закрыта'
            &&
            order.status !== 'Отменена'
            &&
            order.status !== 'Доставлена'
            &&
            order.type === 'DELIVERY_BY_COURIER') {
            return <Order order={order} key={i} employees={employees} />
        }
    })

    useEffect(() => {
        if (token) {
            refreshEmployees(token);
        }
        // eslint-disable-next-line
    }, []);

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
            <div className="o-list">
                <div className="o-list-header">
                    <div className="o-list-header__item">Номер</div>
                    <div className="o-list-header__item">Створена</div>
                    <div className="o-list-header__item" style={{ textAlign: 'center' }}>Статус</div>
                    <div className="o-list-header__item" style={{ paddingLeft: '30px' }}>Кухня</div>
                    <div className="o-list-header__item">Дедлайн</div>
                    <div className="o-list-header__item">Адреса</div>
                    <div className="o-list-header__item">Курьер</div>
                </div>
                {list}
            </div>
        </section>
    )
}

export default OrdersList;