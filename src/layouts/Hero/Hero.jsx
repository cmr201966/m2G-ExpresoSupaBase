// styles
import "./styles.css"

import PropTypes from "prop-types"

const Hero = (props) => {
    const { children, clase } = props
    return (
        <div className={`${clase}`}>
            {children}
        </div>
    );
};

Hero.propTypes = {
    children: PropTypes.node.isRequired
}

export default Hero;

{/*        <div className="hero-section">
 */}