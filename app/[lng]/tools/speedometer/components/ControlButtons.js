'use client'
import React from 'react';
import styles from './ControlButtons.module.css';

function ControlButtons(props) {



    return (
        <div className={styles["control-buttons"]} style={props.style}>
            <button onClick={() => { console.log("Add button clicked"); props.onAddRunway(); }}>+</button>
            <button onClick={() => { console.log("Remove button clicked"); props.onRemoveRunway(); }}>-</button>
        </div>
    );
}

export default ControlButtons;
 
