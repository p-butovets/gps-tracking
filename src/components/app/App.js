import { useState } from 'react';

import Heading from '../heading/Heading';
import Button from '../button/Button';

import './app.scss';


function App() {
	/*Хранятся рефы кнопок, чтобы снимать className active */
	const [buttonRefs, setButtonsRefs] = useState([])
	/*Эту функцию передаем в кнопки, чтобы собрать рефы в buttonRefs*/
	const addNewRefToRefs = (newRef) => {
		setButtonsRefs(refs => ([...refs, newRef]))
	}
	/*Функция снимает className active со всех кнопок */
	const toggleActiveClass = (ref) => {
		for (let i in buttonRefs) {
			const name = buttonRefs[i] === ref ? 'button button-active' : 'button '
			buttonRefs[i].current.className = name
		}
	}


	return (
		<div className="App">
			<Heading text="GPS Radar" />
			<section className="btn-warpper">
				<Button
					text="Всі кур'єри"
					addNewRefToRefs={addNewRefToRefs}
					active={true}
					toggleActiveClass={toggleActiveClass}
				/>
				<Button
					text="Всі кур'єри"
					addNewRefToRefs={addNewRefToRefs}
					toggleActiveClass={toggleActiveClass}
				/>
				<Button
					text="Всі кур'єри"
					addNewRefToRefs={addNewRefToRefs}
					toggleActiveClass={toggleActiveClass}
				/>
			</section>
		</div>
	);
}

export default App;
