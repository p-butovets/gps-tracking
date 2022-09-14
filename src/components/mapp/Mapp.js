import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'


import './mapp.scss';

const Mapp = () => {
    const position = [50.4374731495035, 30.51346447588832]
    return (
        <>
            <MapContainer center={position} zoom={11} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            </MapContainer>
        </>
    )
}

export default Mapp;