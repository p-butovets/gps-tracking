import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";

const createRoutineMachineLayer = (props) => {

    const { waypoints } = props;

    const instance = L.Routing.control({
        waypoints: waypoints
    });

    return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;
