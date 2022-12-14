import { Component } from 'react';
import moment from 'moment';

class IikoService extends Component {
    _apiBase = 'https://card.iiko.co.uk:9900/api/0/'
    _apiUserId = 'bagatolososia'
    _apiUserSecret = 'ewn934wffwhyA'
    _apiOrganization = 'b2320000-3838-06a2-edca-08d919d0bc83'

    getResource = async (url, params = null) => {
        let res = await fetch(`${url}?${new URLSearchParams(params)}`);

        if (!res.ok) {
            throw new Error(`Failed to fetch ${url} status ${res.status}`);
        }
        return await res.json();
    }

    getToken = async () => {
        const params = {
            user_id: this._apiUserId,
            user_secret: this._apiUserSecret
        }
        const res = await this.getResource(`${this._apiBase}auth/access_token`, params)
        return res
    }

    getActualOrders = async (token, mode) => {
        const today = moment().format().split('T')[0]
        const actualOrders = [];
        const params = {
            access_token: token,
            organization: this._apiOrganization,
            dateTo: today,
            dateFrom: today
        }
        const res = await this.getResource(`${this._apiBase}orders/deliveryOrders`, params)

        switch (mode) {
            case 'ACTUAL':
                res.deliveryOrders.forEach(order => {
                    if (order.courierInfo && order.courierInfo.location && order.orderLocationInfo) {
                        actualOrders.push(this._transformOrderForRadar(order))
                    }
                })
                return actualOrders;
            case 'ALL':
                res.deliveryOrders.forEach(order => {
                    actualOrders.push(this._transformOrderForList(order))
                })
                return actualOrders;
        }
    }

    _transformOrderForRadar = (order) => {
        return {
            id: order.orderId,
            number: order.number,
            status: order.status,
            type: order.orderType.orderServiceType,
            kitchen: order.deliveryTerminal.restaurantName,
            deliveryTerminalId: order.deliveryTerminal.deliveryTerminalId,
            deadline: order.deliveryDate.split(' ')[1],
            orderLocationInfo: order.orderLocationInfo,
            courier: {
                courierId: order.courierInfo.courierId,
                location: {
                    latitude: order.courierInfo.location.latitude,
                    longitude: order.courierInfo.location.longitude
                }
            },
            address: `${order.address.street}, ${order.address.home}`
        }
    }

    _transformOrderForList = (order) => {
        // console.log(order)

        /*?????????? ???? ???????? ???????????????????? ??????????*/
        let kitchen = '???? ????????????????????';
        if (order.deliveryTerminal) {
            kitchen = order.deliveryTerminal.restaurantName
        }

        /*?????????? ???? ???????? ???????????? ????????????????*/
        let address = '???? ????????????????????';
        if (order.address) {
            address = `${order.address.street}, ${order.address.home}`
        }

        /*???????? ???????????? ???? ???????????????? */
        let courierId;
        if (order.courierInfo) {
            courierId = order.courierInfo.courierId
        }

        return {
            id: order.orderId,
            number: order.number,
            status: order.status,
            type: order.orderType.orderServiceType,
            kitchen: kitchen,
            deadline: order.deliveryDate.split(' ')[1],
            created: order.createdTime.split(' ')[1],
            address: address,
            courierId: courierId,
            items: order.items
        }
    }

    getDeliveryTerminals = async (token) => {
        const params = {
            access_token: token,
            organization: this._apiOrganization,
        }
        const res = await this.getResource(`${this._apiBase}deliverySettings/getDeliveryTerminals`, params)
        return res.deliveryTerminals
    }

    getCouriers = async (token) => {
        const params = {
            access_token: token,
            organization: this._apiOrganization,
        }
        const res = await this.getResource(`${this._apiBase}rmsSettings/getCouriers`, params)
        return res.users
    }

}

export default IikoService;