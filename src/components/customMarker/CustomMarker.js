import './customMarker.scss';
import free from "../../resources/free.png";
import onway from "../../resources/onway.png";

const CustomMarker = (props) => {

    const status = props.status;

    return (
        <div className="custom-marker">
            <img className="custom-marker-img" src={`${status === 'onway' ? onway : free}`} alt={"marker"} />
        </div>
    )
}

export default CustomMarker;