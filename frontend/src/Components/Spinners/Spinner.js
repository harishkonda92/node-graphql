import React from 'react';
import './Spinner.css'
const Spinner = (props) => (
    <div className="spinner">
        <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
        </div>
    </div>
)

export default Spinner;