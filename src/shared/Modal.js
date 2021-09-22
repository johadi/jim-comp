import './styles/Modal.css';

const Modal = ({children, isOpen, handleClose, title}) => (
    <>
        <div onClick={handleClose} className={`backdrop ${isOpen ? 'open' : ''}`}></div>

        <div className={`modal ${isOpen ? 'open' : ''}`}>
            <div className="modal-close">
                <button onClick={handleClose} className="close">X</button>
            </div>
            {title && <h3 className="modal-header">{title}</h3>}
            <div  className="modal-content">
                {children}
            </div>
        </div>
    </>
);

export default Modal;


// const Modal = ({children, isOpen, handleClose}) => {
//     const classList = isOpen ? 'modal display-block': 'modal display-none'
//     return (
//         <div className={classList}>
//             <div className="modal-main">
//                 <h3 className="modal-header">Do you want to continue?</h3>
//                 <div  className="modal-content">
//                     {children}
//                 </div>
//                 <div className="modal-footer">
//                     <button onClick={handleClose} className="close">Close</button>
//                 </div>
//             </div>
//         </div>
//     );
// }
