import './dashboardItem.scss';

const DashboardItem = (props) => {

    const { title, value } = props;

    return (
        <div className="dashboard-item">
            <div className="dashboard-item__title">{title}</div>
            <div className="dashboard-item__value">{value}</div>
        </div>
    )
}

export default DashboardItem;