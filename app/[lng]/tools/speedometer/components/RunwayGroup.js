    //RunwaygGroup.js
    'use client'
    import React, { useState } from 'react';
    import CircleUpload from './CircleUpload';
    import styles from './RunwayGroup.module.css';
    import { useSpeedData } from './SpeedDataContext.js';

    function RunwayGroup({ runwayIndex, gridRow }) {
        const {
            useLongPress,
            overallDistance, runwayIDs,

            calculatedDistances, showCalculatedDistances, setShowCalculatedDistances,                   
            calculatedTimes, showCalculatedTimes, setShowCalculatedTimes,
            calculatedSpeeds, showCalculatedSpeeds, setShowCalculatedSpeeds,

            activeMetrics, setActiveMetrics,
        
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
                            className={styles.userDefinedInput}
                        />
                    ) : (
                        <button
                            {...longPressHandlers}
                            className={styles.lengthLabelButton}
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
                            className={styles.userDefinedInput}
                        />
                    ) : (
                        <button
                            {...longPressHandlers}
                            className={styles.lengthLabelButton}
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
                            className={styles.userDefinedInput}
                        />
                        ) : (
                        <button
                                {...longPressHandlers}
                                className={styles.lengthLabelButton}
                            >
                                {`${displayValue}m/s`}
                            </button>
                        )
                    }
                </div>            
            )

        };


        const ActiveMetricCircles = () => {
            return (
                <div>
                    {['distance', 'time', 'speed'].map(metric => (
                        <span
                            key={metric}
                            onClick={() => {
                                const updatedMetrics = [...activeMetrics];
                                updatedMetrics[runwayIndex] = metric;
                                setActiveMetrics(updatedMetrics);
                            }}
                            style={{
                                display: 'inline-block',
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: activeMetrics[runwayIndex] === metric ? 'green' : 'grey',
                                margin: '5px'
                            }}
                        ></span>
                    ))}
                </div>
            );
        };

       

        return (
            <div className={styles.runwayGroup} style={{ gridRow: gridRow }}>
                <div className={styles.dashboardContainer}>
                    {DisplayTravelDistance()}
                    {DisplayTravelTime()}
                    {DisplayTravellSpeed()}
                </div>
            

                <CircleUpload runwayIndex={runwayIndex} />
            
            
            </div>
        );
    }

    export default RunwayGroup;