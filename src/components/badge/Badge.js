import './badge.scss';

const Badge = (props) => {

    let colorClass;
    const status = props.status;
    if (status === "В пути") {
        colorClass = "green";
    } else if (status === "Готово") {
        colorClass = "yellow";
    } else {
        colorClass = "gray";
    }


    return (
        <div className={`badge ${colorClass}`}>{status}</div>
    )
}

export default Badge;