'use client'
import React from 'react';

function ControlButtons(props) {

    return (
        <div className="space-x-2 ml-4">
            <button 
                onClick={() => {props.onAddRunway(); }}
                className="w-8 h-8 bg-amber-200 text-amber-600 rounded hover:bg-amber-300 focus:outline-none"
            >
                +
            </button>
            <button 
                onClick={() => {props.onRemoveRunway(); }}
                className="w-8 h-8 bg-amber-200 text-amber-600 rounded hover:bg-amber-300 focus:outline-none "
            >
                -
            </button>
        </div>

    );
}

export default ControlButtons;
 
