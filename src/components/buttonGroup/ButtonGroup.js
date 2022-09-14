import { useState } from 'react';
import Button from '../button/Button';
import './buttonGroup.scss';

const ButtonGroup = (props) => {
    /*получаем список терминалов доставки */
    const { terminals, setVisibleTerminal } = props;

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

    /*Формируем кнопку для каждого теминала доставки */
    const buttons = terminals.map((i) => {
        return (
            <Button
                id={i.deliveryTerminalId}
                key={i.deliveryTerminalId}
                text={i.deliveryRestaurantName}
                addNewRefToRefs={addNewRefToRefs}
                active={false}
                setVisibleTerminal={setVisibleTerminal}
                toggleActiveClass={toggleActiveClass}
            />
        );
    });



    return (
        <section className="btn-warpper">
            <Button // одна дополнителная кнопка, чтобы показать всех курьеров
                //ЧТобы показать всех курьеров - этой кнопкой ставим id видимого терминала null
                id={null}
                key={"111-222-333"}
                text="Всі кур'єри"
                addNewRefToRefs={addNewRefToRefs}
                active={true}
                setVisibleTerminal={setVisibleTerminal}
                toggleActiveClass={toggleActiveClass}
            />
            {buttons}
        </section>
    )
}

export default ButtonGroup;