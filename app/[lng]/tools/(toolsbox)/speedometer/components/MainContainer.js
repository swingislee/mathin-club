'use client'

import React, { useState } from 'react';
import RunwayGroup from './RunwayGroup';
import ControlButtons from './ControlButtons';
import RunwayLength from './RunwayLength';
import Timer from './Timer';
import { useSpeedData } from './SpeedDataContext';

function MainContainer () { 
    const [numOfRunways, setNumOfRunways] = useState(1);
    const [buttonRowPosition, setButtonRowPosition] = useState(4);
    const { addRunway, removeRunway } = useSpeedData();

    const onAddRunway = () => {
        setNumOfRunways(prevNum => prevNum + 1);
        setButtonRowPosition(prevRow => prevRow + 1);
        addRunway();
    }

    const onRemoveRunway = () => {
        if (numOfRunways > 1) {
            setNumOfRunways(prevNum => prevNum - 1);
            setButtonRowPosition(prevRow => prevRow - 1);
            removeRunway();
        }
    }

    return (
        <div className="relative w-full h-full">
            <Timer />
            {Array.from({ length: numOfRunways }).map((_, index) => (
                <RunwayGroup key={index} runwayIndex={index} />
            ))}
            <RunwayLength/>
            <ControlButtons onAddRunway={onAddRunway} onRemoveRunway={onRemoveRunway} />
        </div>
    );
}


export default MainContainer;
