// styles
import "./style.css"

import useOnclickOutside from "react-cool-onclickoutside";

const Modal = (props) => {

    const { visible, onClose, children, className, classContainer } = props

    const ref = useOnclickOutside(() => {
        if (visible) onClose(true)
    })
    return <div className={`modal-container ${classContainer}`} style={{ zIndex: visible ? 99 : -1 }}>
        <div ref={ref} className={`modal-content ${className}`} style={{ transform: visible ? "scale(1)" : "scale(0)" }}>
            {children}
        </div>
    </div>
}

export default Modal;
