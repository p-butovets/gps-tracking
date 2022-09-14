import { useState, useEffect } from 'react';

import IikoService from "../../services/iikoService";

import Spinner from "../spinner/Spinner";
import Heading from '../heading/Heading';
import ButtonGroup from '../buttonGroup/ButtonGroup';
import Mapp from '../mapp/Mapp';

import './app.scss';


function App() {

	/*храним доставочные терминалы */
	const [terminals, setTerminals] = useState([]);
	/*храним список заказов*/
	const [orders, setOrders] = useState(null);
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
		setOrders(orders);
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
		setInterval(() => refreshToken(), 5000);
		// eslint-disable-next-line
	}, []);

	/*когда обновляется токен*/
	useEffect(() => {
		//1. обновляем список терминалов доствки
		refreshTerminalsList();

		//2. обновляем список заказов
		refreshOrders(token);
		// eslint-disable-next-line
	}, [token]);


	return (
		<div className="App">
			{loading
				? <Spinner />
				:
				<View
					terminals={terminals}
					setVisibleTerminal={setVisibleTerminal}
					orders={orders}
					visbleTerminal={visbleTerminal}
					token={token}
				/>}
		</div>
	);
}

const View = (props) => {

	const { terminals, setVisibleTerminal, orders, visbleTerminal, token } = props;

	return (
		<>
			<Heading text="GPS Radar" />
			<ButtonGroup terminals={terminals} setVisibleTerminal={setVisibleTerminal} />
			<section>
				<Mapp
					orders={orders}
					visbleTerminal={visbleTerminal}
					token={token}
				/>
			</section>
		</>
	)
}

export default App;
