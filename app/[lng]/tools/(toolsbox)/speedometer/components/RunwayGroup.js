    //RunwaygGroup.js
    'use client'
    import React, { useState } from 'react';
    import CircleUpload from './CircleUpload';
    import styles from './RunwayGroup.module.css';
    import { useSpeedData } from './SpeedDataContext.js';

    function RunwayGroup({runwayIndex}) {
        const {
            useLongPress,
            overallDistance, runwayIDs,

            calculatedDistances, showCalculatedDistances, setShowCalculatedDistances,                   
            calculatedTimes, showCalculatedTimes, setShowCalculatedTimes,
            calculatedSpeeds, showCalculatedSpeeds, setShowCalculatedSpeeds,

            calculateSelect, setCalculateSelect,setSelectOption,
        
            userDefinedDistances, handleUserDefinedDistanceChange,
            userDefinedTimes, handleUserDefinedTimeChange,
            userDefinedSpeeds, handleUserDefinedSpeedChange,
        } = useSpeedData();

        const [editingTravelDistance, setEditingTravelDistance] = useState(false);  // For toggling input box for length   
        const [editingTravelTime, setEditingTravelTime] = useState(false);  // For toggling input box for time
        const [editingTravelSpeed, setEditingTravelSpeed] = useState(false);  // For toggling input box for speed
        const [tempValue, setTempValue] = useState(""); // Temporary storage for input value

        const DisplayTravelDistance = () => {
            const displayValue = showCalculatedDistances[runwayIndex] ? calculatedDistances[runwayIndex] : userDefinedDistances[runwayIndex];

            const showdistance = () => {
                setShowCalculatedDistances(prevDistances => {
                    const updatedDistances = [...prevDistances];
                    updatedDistances[runwayIndex] = false;
                    return updatedDistances;
                });
            };

            const longPressHandlers = useLongPress(
                () => {
                    setEditingTravelDistance(true);
                    showdistance()
                }
                ,  // Short press function    
                () => {
                    handleUserDefinedDistanceChange(overallDistance, runwayIndex);
                    showdistance()
                }  // Long press function                
            );

            return (
                <div className={styles.userDefinedLabel}>
                    {editingTravelDistance ? (
                        <input
                            type="number"
                            onChange={(e) => setTempValue(e.target.value)} // Update the temporary value on change
                            onBlur={() => {
                                handleUserDefinedDistanceChange(tempValue, runwayIndex); // Update the array on blur
                                setEditingTravelDistance(false);
                            }}
                            autoFocus
                            className="w-12"
                        />
                    ) : (
                        <button
                            {...longPressHandlers}
                        >
                            {`${displayValue}m`}
                        </button>
                    )
                    }
                </div>
            );
        };

        const DisplayTravelTime = () => {
            const displayValue = showCalculatedTimes[runwayIndex] ? calculatedTimes[runwayIndex] : userDefinedTimes[runwayIndex];

            const showtime = () => {
                setShowCalculatedTimes(prevTimes => {
                    const updatedTimes = [...prevTimes];
                    updatedTimes[runwayIndex] = false;
                    return updatedTimes;
                });
            };

            const longPressHandlers = useLongPress(
                () => {
                    setEditingTravelTime(true);
                    showtime()
                }
                ,  // Short press function    
                () => {
                    handleUserDefinedTimeChange(0, runwayIndex);
                    showtime()
                }  // Long press function                
            );

            return (
                <div className={styles.userDefinedLabel}>
                    {editingTravelTime ? (
                        <input
                            type="number"
                            onChange={(e) => setTempValue(e.target.value)} // Update the temporary value on change
                            onBlur={() => {
                                handleUserDefinedTimeChange(tempValue, runwayIndex); // Update the array on blur
                                setEditingTravelTime(false);
                            }}
                            autoFocus
                            className="w-12"
                        />
                    ) : (
                        <button
                            {...longPressHandlers}
                        >
                            {`${displayValue}s`}
                        </button>
                    )
                    }
                </div>
            )

        };

        const DisplayTravellSpeed = () => {
            const displayValue = showCalculatedSpeeds[runwayIndex] ? calculatedSpeeds[runwayIndex] : userDefinedSpeeds[runwayIndex];

            const showspeed = () => {
                setShowCalculatedSpeeds(prevSpeeds => {
                    const updatedSpeeds = [...prevSpeeds];
                    updatedSpeeds[runwayIndex] = false;
                    return updatedSpeeds;
                });
            };

            const longPressHandlers = useLongPress(
                () => {
                    setEditingTravelSpeed(true);
                    showspeed()
                }
                ,  // Short press function    
                () => {
                    handleUserDefinedSpeedChange(0, runwayIndex);
                    showspeed()
                }  // Long press function                
            );
      
            return (
                <div  className={styles.userDefinedLabel}>
                    {editingTravelSpeed ? (
                        <input
                            type="number"
                            onChange={(e) => setTempValue(e.target.value)} // Update the temporary value on change
                            onBlur={() => {
                                handleUserDefinedSpeedChange(tempValue, runwayIndex); // Update the array on blur
                                setEditingTravelSpeed(false);
                            }}
                            autoFocus
                            className="w-12"                        
                        />
                        ) : (
                        <button
                                {...longPressHandlers}
                            >
                                {`${displayValue}m/s`}
                            </button>
                        )}
                </div>            
            )

        };
        
        return (
            <div className="bg-green-200 w-full h-24 my-2">
                <div className="absolute left-0 right-[90%] h-24 bg-cyan-500 p-2">
                    <div className="flex items-center h-full space-x-2">
                        <div className="flex flex-col justify-between h-full space-y-2 ">
                            <div
                                className={`w-4 h-4 border-2 rounded-full cursor-pointer ${calculateSelect[runwayIndex] === 'distance' ? 'bg-green-200' : 'bg-transparent'}`}
                                onClick={() => setSelectOption(runwayIndex,'distance')}
                            ></div>
                            <div
                                className={`w-4 h-4 border-2 rounded-full cursor-pointer ${calculateSelect[runwayIndex] === 'time' ? 'bg-green-200' : 'bg-transparent'}`}
                                onClick={() => setSelectOption(runwayIndex,'time')}
                            ></div>
                            <div
                                className={`w-4 h-4 border-2 rounded-full cursor-pointer ${calculateSelect[runwayIndex] === 'speed' ? 'bg-green-200' : 'bg-transparent'}`}
                                onClick={() => setSelectOption(runwayIndex,'speed')}
                            ></div>
                        </div>
                        <div className="flex flex-col justify-center  h-full space-y-2 ">
                            {DisplayTravelDistance()}  {/* Assuming these functions render your input boxes */}
                            {DisplayTravelTime()}
                            {DisplayTravellSpeed()}
                        </div>
                    </div>
                </div>


                <CircleUpload runwayIndex={runwayIndex} />
            </div>
        );
    }

    export default RunwayGroup;