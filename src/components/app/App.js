import { useState, useEffect } from 'react';

import IikoService from "../../services/iikoService";

import Heading from '../heading/Heading';
import ButtonGroup from '../buttonGroup/ButtonGroup';
import Mapp from '../mapp/Mapp';

import './app.scss';


function App() {

	/*храним доставочные терминалы */
	const [terminals, setTerminals] = useState([]);
	/*iiko token */
	const [token, setToken] = useState(null);
	/*закончилась ли загрузка данных */
	const [loading, setLoading] = useState(true);
	/* экземпляр сервиса iiko*/
	const iikoservice = new IikoService();


	/*Чтобы показать прелоадер*/
	const onLoading = () => setLoading(true)
	const onLoaded = () => setLoading(false)


	/*work with token */
	const onTokenRefreshed = (newToken) => setToken(newToken)

	const refreshToken = () => {
		iikoservice.getToken().then(onTokenRefreshed);
	};


	/*create terminals list */
	const onTerminalsRefreshed = (terminals) => {
		onLoaded();
		setTerminals(terminals);
	};

	const refreshTerminalsList = () => {
		if (token) {
			iikoservice.getDeliveryTerminals(token).then(onTerminalsRefreshed);
		}
	};

	useEffect(() => {
		refreshTerminalsList();
	}, [token]);


	/*когда рендерится компонент*/
	useEffect(() => {
		//1. запускаем обновление инфы с интервалом
		// setInterval(() => refreshToken(), 5000);
		refreshToken()
		// eslint-disable-next-line
	}, []);



	return (
		<div className="App">
			<Heading text="GPS Radar" />
			<ButtonGroup terminals={terminals} />
			<section>
				<Mapp />
			</section>

		</div>
	);
}

export default App;
