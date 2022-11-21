import './heading.scss';

const Heading = (props) => {
    return (
        <section className="heading">
            {props.text}<span className="version">v0.2.0</span>
        </section>
    )
}

export default Heading;