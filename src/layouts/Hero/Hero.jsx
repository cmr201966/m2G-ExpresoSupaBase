// styles
import "./styles.css"

import PropTypes from "prop-types"

const Hero = (props) => {
    const { children } = props
    return (
        <div className="hero-section">
            {children}
        </div>
    );
};

Hero.propTypes = {
    children: PropTypes.node.isRequired
}

export default Hero