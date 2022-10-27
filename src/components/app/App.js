import { useState, useEffect } from 'react';
import IikoService from "../../services/iikoService";
import Spinner from "../spinner/Spinner";
import Heading from '../heading/Heading';
import ButtonGroup from '../buttonGroup/ButtonGroup';
import Mapp from '../mapp/Mapp';

import './app.scss';
import terminalsLocationData from '../../data/terminalsLocationData.json';

//demoData to dev
import fakeOrders from '../../fakeData/fakeOrders.json';

function App() {

	/*храним доставочные терминалы */
	const [terminals, setTerminals] = useState([]);
	/*храним список заказов*/
	const [actualOrders, setActualOrders] = useState(null);
	/* Каких курьеров показывать */
	const [visbleTerminal, setVisibleTerminal] = useState(null);
	/*iiko token */
	const [token, setToken] = useState(null);
	/*закончилась ли загрузка данных */
	const [loading, setLoading] = useState(true);
	/*если ошибка*/
	// const [error, setError] = useState(false);
	/* экземпляр сервиса iiko*/
	const iikoservice = new IikoService();

	// объект курьеров и их заказов
	const [couriers, setCouriers] = useState({});

	/*Чтобы показать прелоадер*/
	// const onLoading = () => setLoading(true)
	const onLoaded = () => setLoading(false)
	// const onError = () => setError(true)


	/*work with token */
	const onTokenRefreshed = (newToken) => setToken(newToken)

	const refreshToken = () => {
		iikoservice.getToken().then(onTokenRefreshed);
	};


	/*work with terminals list */
	const onTerminalsRefreshed = (terminals) => {
		setTerminals(terminals);
	};

	const refreshTerminalsList = () => {
		if (token) {
			iikoservice.getDeliveryTerminals(token).then(onTerminalsRefreshed);
		}
	};


	/*work with orders */
	const onOrdersRefreshed = (orders) => {
		onLoaded();
		setActualOrders(orders);
	};

	const refreshOrders = (token) => {
		if (token) {
			iikoservice.getAllOrders(token).then(onOrdersRefreshed);
		}
	};


	/*когда рендерится компонент*/
	useEffect(() => {
		//1. запускаем обновление инфы с интервалом
		refreshToken()
		setInterval(() => refreshToken(), 20000);
		// eslint-disable-next-line
	}, []);


	/*когда обновляется токен*/
	useEffect(() => {
		//1. обновляем список терминалов доставки
		refreshTerminalsList();

		//2. обновляем список заказов
		refreshOrders(token);
		// eslint-disable-next-line
	}, [token]);



	/*Создаем и обновляем объект курьеров и их заказов */

	/* Обновляет объект айдишниками курьеров у которых уже есть заказы*/
	const updateCouriersOnDuty = (orders) => {
		for (let i in orders) {
			const courierId = orders[i].courier.courierId;
			if (!couriers.hasOwnProperty(courierId)) {
				couriers[orders[i].courier.courierId] = { orders: [], latitude: null, longitude: null, terminal: {} };
			}
		}
	}

	/*сбрасывает массивы заказов у курьеров */
	const clearOrders = (couriers) => {
		for (let i in couriers) {
			couriers[i].orders = [];
		}
	}

	/*у заказа берем адйи терминала, по нему возвращем инфу про бейс локейшн для курьера*/
	/*может измениться, если последний заказ курьеру назначен с другой кухни */
	const getBaseLocationByTerminalId = (terminalId) => {
		for (let i of terminalsLocationData) {
			if (terminalId === i.id) {
				return [i.lat, i.long]
			}
		}
	}

	/* Обновляет массивы с айди заказов каждого курьера и обновляет location и терминал */
	const updateOrdersForEachCourier = (orders) => {
		for (let i in orders) {
			const courierId = orders[i].courier.courierId;

			//обновили локейшн
			couriers[courierId].latitude = orders[i].courier.location.latitude;
			couriers[courierId].longitude = orders[i].courier.location.longitude;

			//определили терминал
			couriers[courierId].terminal['id'] = orders[i].deliveryTerminalId

			//установили координаты терминала
			const [lat, long] = getBaseLocationByTerminalId(orders[i].deliveryTerminalId)
			couriers[courierId].terminal['lat'] = lat;
			couriers[courierId].terminal['long'] = long;

			//насыпаем актуальные айдишники заказов
			//исключаем CLOSED & DELIVERED
			if (orders[i].status !== "DELIVERED" && orders[i].status !== "CLOSED") {
				couriers[courierId].orders.push(orders[i].id)
			}
		}
	}

	/*когда обновляется state actualOrders */
	useEffect(() => {
		//обновляем курьеров
		updateCouriersOnDuty(actualOrders);

		// сбрасываем заказы у курьеров
		clearOrders(couriers)

		//обновляем заказы и location каждого курьера
		updateOrdersForEachCourier(actualOrders);
	}, [actualOrders]);

	return (
		<div className="App">
			{loading
				? <Spinner />
				:
				<View
					terminals={terminals}
					setVisibleTerminal={setVisibleTerminal}
					couriers={couriers}
					visbleTerminal={visbleTerminal}
					token={token}
					actualOrders={actualOrders}
				/>}
		</div>
	);
}

const View = (props) => {

	const { terminals, setVisibleTerminal, couriers, visbleTerminal, token, actualOrders } = props;

	return (
		<>
			<Heading text="GPS Radar" />
			<ButtonGroup terminals={terminals} setVisibleTerminal={setVisibleTerminal} />
			<section>
				<Mapp
					couriers={couriers}
					visbleTerminal={visbleTerminal}
					token={token}
					actualOrders={actualOrders}
				/>
			</section>
		</>
	)
}

export default App;
