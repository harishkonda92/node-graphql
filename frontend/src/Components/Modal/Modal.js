import React from 'react';
import './Modal.css'
const modal = (props) => {
    return <div className="modal">
        <header className="modal__header">{props.title}</header>
        <section className="modal__content">
            {props.children}
        </section>
        <section className="modal__actions">
            {props.canCancel && <button onClick={props.onCancel}>Cancel</button>}
            {props.canConfirm && <button onClick={props.onConfirm}>{props.confirmText}</button>}
        </section>

    </div>
}

export default modal;