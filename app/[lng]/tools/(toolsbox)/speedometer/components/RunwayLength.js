import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './RunwayLength.module.css';
import { useSpeedData } from './SpeedDataContext.js';


function RunwayLength(props) {
    const { handleStartingGunClick, overallDistance, setOverallDistance, reoverallDistance, unitPixelValue, useLongPress  } = useSpeedData();
    const [editingLength, setEditingLength] = useState(false);  // For toggling input box for length


    function getTickInterval(value) {
        // get the power of 10 for the number
        let power = Math.floor(Math.log10(Math.abs(value)));

        // get the most significant number
        let leadingNumber = value / Math.pow(10, power);
        let tickInterval;

        if (leadingNumber < 1.4) {
            tickInterval = Math.pow(10, power - 1);
        } else if (leadingNumber < 2.8) {
            tickInterval = 2 * Math.pow(10, power - 1);
        } else if (leadingNumber < 7) {
            tickInterval = 5 * Math.pow(10, power - 1);
        } else {
            tickInterval = Math.pow(10, power);
        }

        return tickInterval;
    }

    let tickInterval = getTickInterval(overallDistance);

    function getDecimalPlaces(num) {
        const match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
        if (!match) return 0;
        // Number of digits right of decimal point.
        return Math.max(
            0,
            // Number of digits right of decimal point.
            (match[1] ? match[1].length : 0)
            // Adjust for scientific notation.
            - (match[2] ? +match[2] : 0));
    }

    const decimalPlaces = getDecimalPlaces(tickInterval);


    const calculatedScaleSpacing = tickInterval * unitPixelValue;
    const tickMarks = [];
    let position = 24;

    while (position <= (0.8 * window.innerWidth) - 24) {
        if (position > (0.8 * window.innerWidth) - 24) {
            break;  // Exit the loop if position exceeds the limit
        }

        tickMarks.push(position);
        position += calculatedScaleSpacing;
    }
        

    const InputOverallDistance = () => {
        const longPressHandlers = useLongPress(
            () => setEditingLength(true),      // Short press function
            reoverallDistance                  // Long press function
        );

        return (
            <div className={styles.lengthLabel}>
                {editingLength ? (
                    <input
                        type="number"
                        onChange={(e) => setOverallDistance(e.target.value)}
                        autoFocus
                        onBlur={() => setEditingLength(false)}
                    />
                ) : (
                    <button
                        {...longPressHandlers}
                        className={styles.lengthLabelButton}
                    >
                        {`${overallDistance}m`}
                    </button>
                )}
            </div>
        );
    };
    


    return (
            <motion.div drag="y">
                <div className="absolute h-16 bg-sky-900 bg-opacity-50 left-[10%] right-[10%] z-30">
                    <div className='absolute w-100 t-0 h-6 flex items-center'>
                        {tickMarks.map((pos, idx) => (
                            <div key={idx} className='absolute flex w-auto h-full px-1 bg-transparent' style={{ left: pos }}>
                                <div className='w-0.5 translate-x-[-5px] h-full bg-white'></div>
                                {((idx) * tickInterval).toFixed(decimalPlaces)}
                            </div>
                        ))}
                    </div>
                    <div className={styles.brace}></div>
                    <div className={styles.horizontalLine}></div>
                    {InputOverallDistance()}
                    <button
                        className={styles.startingGun}
                        onClick={() => {
                            handleStartingGunClick();
                            console.log("click");
                        }}
                    >
                        Starting Gun
                    </button>
                    <div className={styles.dragHandle}>Drag Me</div> {/* Drag handle added here */}
                </div>
            </motion.div>
    );

}

export default RunwayLength;