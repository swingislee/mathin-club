    //SpeedDataContext.js   Data source of character movement speed , time and distance
    'use client'
    import React, { createContext, useState, useContext, useEffect } from 'react';

    const SpeedDataContext = createContext();

    export const useSpeedData = () => {
        return useContext(SpeedDataContext);
    };



    export const SpeedDataProvider = ({ children }) => {

        //Overall length setting
        const [overallDistance, setOverallDistance] = useState(100);  // Default length
        const screenPixels = (0.8 * window.innerWidth)-48;
        const startLineX = (0.1 * window.innerWidth)+24;
        const unitPixelValue = screenPixels / (overallDistance);
        const reoverallDistance = () => {
            setOverallDistance(100);  // Reset to default
        };

        const [times, setTimes] = useState([]);
        const [isGunFired, setIsGunFired] = useState(false);
        const [runwayIDs, setRunwayIDs] = useState([1]);

        // Arrays for each runway calculate data
        const [calculatedDistances, setCalculatedDistances] = useState([0]);
        const [calculatedTimes, setCalculatedTimes] = useState([0]);
        const [calculatedSpeeds, setCalculatedSpeeds] = useState([0]);

        const [showCalculatedDistances, setShowCalculatedDistances] = useState([false]);
        const [showCalculatedTimes, setShowCalculatedTimes] = useState([false]);
        const [showCalculatedSpeeds, setShowCalculatedSpeeds] = useState([false]);

        const [calculateSelect, setCalculateSelect] = useState(["speed"]);

        

        // User-defined values
        const [userDefinedDistances, setUserDefinedDistances] = useState([overallDistance]);// Default is overallDistance
        const [userDefinedTimes, setUserDefinedTimes] = useState([1]);
        const [userDefinedSpeeds, setUserDefinedSpeeds] = useState([0]);

        //Manage array changes corresponding to runway increases and decreases
        const addRunway = () => {
            // Get the last ID from runwayIDs. If the array is empty, default to 0.
            const lastID = runwayIDs.length > 0 ? runwayIDs[runwayIDs.length - 1] : 0;

            // Add the new ID (lastID + 1) to runwayIDs.
            setRunwayIDs([...runwayIDs, lastID + 1]);
            setUserDefinedSpeeds([...userDefinedSpeeds, 0]);
            setUserDefinedTimes([...userDefinedTimes, 1]);
            setUserDefinedDistances([...userDefinedDistances, overallDistance]);
            setCalculateSelect([...calculateSelect, "speed"]);
        };

        const removeRunway = (runwayIndex) => {
            if (runwayIDs.length <= 1) {
                // If the number of runways is 1 or less, exit the function early without doing anything.
                return;
            }

            // Remove the last ID from runwayIDs.
            setRunwayIDs(runwayIDs.slice(0, -1));

            // Remove the last value from each of the other arrays.
            setCalculatedDistances(calculatedDistances.slice(0, -1));
            setCalculatedTimes(calculatedTimes.slice(0, -1));
            setCalculatedSpeeds(calculatedSpeeds.slice(0, -1));
            setShowCalculatedDistances(showCalculatedDistances.slice(0, -1));
            setShowCalculatedTimes(showCalculatedTimes.slice(0, -1));
            setShowCalculatedSpeeds(showCalculatedSpeeds.slice(0, -1));
            setUserDefinedSpeeds(userDefinedSpeeds.slice(0, -1));
            setUserDefinedTimes(userDefinedTimes.slice(0, -1));
            setUserDefinedDistances(userDefinedDistances.slice(0, -1));
            setCalculateSelect(calculateSelect.slice(0, -1))
        };


        //Keep decimals tool
        function formatnumb(data) {
            const absoluteData = Math.abs(data);
            // Check if absolute data is between 0 and 1
            if (0 < absoluteData && absoluteData < 1) {
                return parseFloat(data.toPrecision(2)).toString();
            } else {
                return parseFloat(data.toFixed(2)).toString();
            }
        }

        const [shouldRecalculate, setShouldRecalculate] = useState(false);
        const [lastUpdatedIndex, setLastUpdatedIndex] = useState(null);

        const calculateAndUpdate = (index) => {            
            switch (calculateSelect[index]) {
                case "speed":
                    const calculatedSpeed = userDefinedDistances[index] / userDefinedTimes[index];
                    let newSpeeds = [...calculatedSpeeds];
                    newSpeeds[index] = calculatedSpeed;
                    setCalculatedSpeeds(newSpeeds);
    
                    let newShowSpeeds = [...showCalculatedSpeeds];
                    newShowSpeeds[index] = true;
                    setShowCalculatedSpeeds(newShowSpeeds);
    
                    let newDistances = [...calculatedDistances];
                    newDistances[index] = userDefinedDistances[index];
                    setCalculatedDistances(newDistances);

                    let newTimes = [...calculatedTimes];
                    newTimes[index] = userDefinedTimes[index];
                    setCalculatedTimes(newTimes);
                    
                    break;
    
                case "time":
                    const calculatedTime = userDefinedDistances[index] / userDefinedSpeeds[index];
                    let newTimes2 = [...calculatedTimes];
                    newTimes2[index] = calculatedTime;
                    setCalculatedTimes(newTimes2);
    
                    let newShowTimes = [...showCalculatedTimes];
                    newShowTimes[index] = true;
                    setShowCalculatedTimes(newShowTimes);
    
                    let newDistances2 = [...calculatedDistances];
                    newDistances2[index] = userDefinedDistances[index];
                    setCalculatedDistances(newDistances2);
    
                    let newSpeeds2 = [...calculatedSpeeds];
                    newSpeeds2[index] = userDefinedSpeeds[index];
                    setCalculatedSpeeds(newSpeeds2);
                    break;
    
                case "distance":
                    const calculatedDistance = userDefinedSpeeds[index] * userDefinedTimes[index];
                    let newDistances3 = [...calculatedDistances];
                    newDistances3[index] = calculatedDistance;
                    setCalculatedDistances(newDistances3);
    
                    let newShowDistances = [...showCalculatedDistances];
                    newShowDistances[index] = true;
                    setShowCalculatedDistances(newShowDistances);
    
                    let newTimes3 = [...calculatedTimes];
                    newTimes3[index] = userDefinedTimes[index];
                    setCalculatedTimes(newTimes3);
    
                    let newSpeeds3 = [...calculatedSpeeds];
                    newSpeeds3[index] = userDefinedSpeeds[index];
                    setCalculatedSpeeds(newSpeeds3);
                    break;
    
                default:
                    break;
            }
        };

        const setSelectOption = (index, option) => {
            setCalculateSelect(prevState => {
                const newData = [...prevState];
                newData[index] = option;
                return newData;
            });
            setLastUpdatedIndex(index);
            setShouldRecalculate(true);        
        };

        //Settings that control user-defined data
        const handleUserDefinedDistanceChange = (value, index) => {
            const updatedUserDefinedDistances = [...userDefinedDistances];
            updatedUserDefinedDistances[index] = value;
            setUserDefinedDistances(updatedUserDefinedDistances);
        
            if (calculateSelect[index] === "distance") {
                setSelectOption(index, "time");
            } else {
                setLastUpdatedIndex(index);
                setShouldRecalculate(true);
            }
        };
        
        const handleUserDefinedTimeChange = (value, index) => {
            const updatedUserDefinedTimes = [...userDefinedTimes];
            updatedUserDefinedTimes[index] = value;
            setUserDefinedTimes(updatedUserDefinedTimes);
        
            if (calculateSelect[index] === "time") {
                setSelectOption(index, "speed");
            } else {
                setLastUpdatedIndex(index);
                setShouldRecalculate(true);
            }
        };
        
        const handleUserDefinedSpeedChange = (value, index) => {
            const updatedUserDefinedSpeeds = [...userDefinedSpeeds];
            updatedUserDefinedSpeeds[index] = value;
            setUserDefinedSpeeds(updatedUserDefinedSpeeds);
        
            if (calculateSelect[index] === "speed") {
                setSelectOption(index, "distance");
            } else {
                setLastUpdatedIndex(index);
                setShouldRecalculate(true);
            }
        };
        
        useEffect(() => {
            if (shouldRecalculate && lastUpdatedIndex !== null) {
                calculateAndUpdate(lastUpdatedIndex);
                setShouldRecalculate(false);
            }
        }, [shouldRecalculate, lastUpdatedIndex]);

        //function1 : Drag the circle and show the speed
        const [dragStartTimes, setDragStartTimes] = useState([]);

        const handleDragStart = (runwayIndex) => {
            const currentTime = new Date().getTime();
            const updatedStartTimes = [...dragStartTimes];
            updatedStartTimes[runwayIndex] = currentTime;
            setDragStartTimes(updatedStartTimes);
        };

        const handleDragStop = (runwayIndex, distance) => {
            const endTime = new Date().getTime();
            const startTime = dragStartTimes[runwayIndex];
            const timeElapsed = (endTime - startTime) / 1000; // Convert milliseconds to seconds
            const speed = distance / timeElapsed;
            const updatedSpeeds = [...calculatedSpeeds];
            updatedSpeeds[runwayIndex] = formatnumb(speed);
            setCalculatedSpeeds(updatedSpeeds);
                
            setCalculatedDistances(prevDistances => {
                const updatedDistances = [...prevDistances];
                updatedDistances[runwayIndex] = formatnumb(distance);
                return updatedDistances;
            });

            setShowCalculatedDistances(prevDistances => {
                const updatedDistances = [...prevDistances];
                updatedDistances[runwayIndex] = true;
                return updatedDistances;
            });

            setCalculatedTimes(prevTimes => {
                const updatedTimes = [...prevTimes];
                updatedTimes[runwayIndex] = formatnumb(timeElapsed);
                return updatedTimes;
            });

            setShowCalculatedTimes(prevTimes => {
                const updatedTimes = [...prevTimes];
                updatedTimes[runwayIndex] = true;
                return updatedTimes;
            });


            setShowCalculatedSpeeds(prevSpeeds => {
                const updatedSpeeds = [...prevSpeeds];
                updatedSpeeds[runwayIndex] = true;
                return updatedSpeeds;
            });
        }

        //Calculate speed time distance        

        const handleTimeSet = (time) => {
            const newTimesArray = new Array(calculatedSpeeds.length).fill(parseFloat(time)); // Create an array filled with the new time for all runways
            setUserDefinedTimes(newTimesArray);
        };


        //Click the starting gun button function to realize motion animation



        const handleStartingGunClick = () => {
            setIsGunFired(true);
        }


        //Recognition commands for long press and click
        function useLongPress(onShortPress, onLongPress, longPressDuration = 500) {
            const [isLongPressActivated, setIsLongPressActivated] = React.useState(false);
            const [hasMoved, setHasMoved] = React.useState(false);
            const [accidentPress, setAccidentPress] = useState(true)
            let pressTimer;

            const startPress = (event) => {
                setAccidentPress(false);
                event.preventDefault();
                event.stopPropagation();  // Preventing the event from propagating to the document
                setHasMoved(false);
                pressTimer = setTimeout(() => {
                    if (!hasMoved) {
                        setIsLongPressActivated(true);
                        onLongPress(event);  // Pass the event
                    }
                }, longPressDuration);
            };

            const handleMove = (event) => {
                setHasMoved(true);
                clearTimeout(pressTimer);
            };

            const endPress = (event) => {
                if (accidentPress) { return };

                event.preventDefault();
                clearTimeout(pressTimer);
                if (!isLongPressActivated && !hasMoved) {
                    onShortPress(event);
                }
                setIsLongPressActivated(false);
            };

            React.useEffect(() => {
                return () => {
                    clearTimeout(pressTimer);
                };
            }, []);

            return {
                onTouchStart: startPress,
                onMouseDown: startPress,
                onMouseUp: endPress,
                onTouchEnd: endPress,
                onTouchMove: handleMove
            };
        }



        return (
            <SpeedDataContext.Provider value={{
                // Runway
                runwayIDs, addRunway, removeRunway,

                // Overall Distance
                overallDistance, setOverallDistance, reoverallDistance,

                // User Defined
                userDefinedDistances, setUserDefinedDistances, handleUserDefinedDistanceChange,
                userDefinedTimes, setUserDefinedTimes, handleUserDefinedTimeChange,
                userDefinedSpeeds, setUserDefinedSpeeds, handleUserDefinedSpeedChange,

                // Calculated
                calculatedDistances, showCalculatedDistances, setShowCalculatedDistances,
                calculatedTimes, showCalculatedTimes, setShowCalculatedTimes,
                calculatedSpeeds, showCalculatedSpeeds, setShowCalculatedSpeeds,
                calculateSelect, setCalculateSelect,setSelectOption,

                // Misc
                unitPixelValue, startLineX,
                times, setTimes, handleTimeSet, isGunFired, setIsGunFired,
                handleDragStart, handleDragStop, handleStartingGunClick,
                useLongPress
            }}>
                {children}
            </SpeedDataContext.Provider>
        );
    };