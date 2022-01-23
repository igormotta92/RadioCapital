import React from 'react';

import './styles.css';

export default function Container(props) {
    return (
        <div className="container">
            {props.children}
        </div>
    );
}


