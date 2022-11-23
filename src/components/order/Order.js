import { useState, useEffect } from 'react';
import './order.scss';

const Order = (props) => {

    const {
        courierId,
        address,
        id,
        items,
        status,
        type,
        kitchen,
        created,
        deadline,
    } = props.order;

    /*данные курьера*/
    const [name, setName] = useState(null);
    const [phone, setPhone] = useState(null);

    /*number бывает null */
    let number = props.order.number;
    if (!number) {
        number = ''
    }

    /*status badge color class */
    let styles;
    switch (status) {
        case 'Новая':
            styles = {
                backgroundColor: '#ccc5b9',
                color: '#fff'
            }
            break
        case 'Готовится':
            styles = {
                backgroundColor: '#ffc300'
            }
            break
        case 'Готово':
            styles = {
                backgroundColor: '#ffc300',
                color: '#679436'
            }
            break
        case 'В пути':
            styles = {
                backgroundColor: '#679436',
                color: '#fff'
            }
            break
    }

    const getCourierById = (courierId) => {
        if (props.employees) {
            for (let i in props.employees) {
                if (props.employees[i].id === courierId) {
                    return [props.employees[i].displayName, props.employees[i].cellPhone]
                }
            }
        }
    };


    /*при рендере компонента*/
    useEffect(() => {
        if (props.employees && courierId) {
            /*ставим инфо курьров*/
            const [name, phone] = getCourierById(courierId);
            setName(name);
            setPhone(phone);
        }

    }, [props.employees, props.order])

    return (
        <div className="o-list-item">
            <div className="o-number">{number}</div>
            <div className="o-created">{created.slice(0, -3)}</div>
            <div className="o-status" style={styles}>
                {status.toLowerCase()}
            </div>
            <div className="o-kitchen">{kitchen}</div>
            <div className="o-deadline">{deadline.slice(0, -3)}</div>
            <div className="o-address">{address}</div>
            <div className="o-courier">{name}</div>
        </div>
    )
}

export default Order;