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
        const screenPixels = (0.8 * window.innerWidth) - 50;
        const startLineX = (0.1 * window.innerWidth);
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

        const [activeMetrics, setActiveMetrics] = useState(Array(runwayIDs.length).fill('distance'));  // default all to distance


        // User-defined values
        const [userDefinedDistances, setUserDefinedDistances] = useState([overallDistance]);// Default is overallDistance
        const [userDefinedTimes, setUserDefinedTimes] = useState([0]);
        const [userDefinedSpeeds, setUserDefinedSpeeds] = useState([0]);

        const [ifUserDefinedDistances, setIfUserDefinedDistances] = useState([false]);
        const [ifUserDefinedTimes, setIfUserDefinedTimes] = useState([false]);
        const [ifUserDefinedSpeeds, setIfUserDefinedSpeeds] = useState([false]);


        //Manage array changes corresponding to runway increases and decreases
        const addRunway = () => {
            // Get the last ID from runwayIDs. If the array is empty, default to 0.
            const lastID = runwayIDs.length > 0 ? runwayIDs[runwayIDs.length - 1] : 0;

            // Add the new ID (lastID + 1) to runwayIDs.
            setRunwayIDs([...runwayIDs, lastID + 1]);
            setUserDefinedSpeeds([...userDefinedSpeeds, 0]);
            setUserDefinedTimes([...userDefinedTimes, 0]);
            setUserDefinedDistances([...userDefinedDistances, overallDistance]);
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

        //Settings that control user-defined data
        const handleUserDefinedDistanceChange = (value, index) => {
            const updatedUserDefinedDistances = [...userDefinedDistances];
            updatedUserDefinedDistances[index] = value;
            setUserDefinedDistances(updatedUserDefinedDistances);

            let newIfDistances = [...ifUserDefinedDistances];
            newIfDistances[index] = true;
            setIfUserDefinedDistances(newIfDistances);
        };

        const handleUserDefinedTimeChange = (value, index) => {
            const updatedUserDefinedTimes = [...userDefinedTimes];
            updatedUserDefinedTimes[index] = value;
            setUserDefinedTimes(updatedUserDefinedTimes);

            let newIfTimes = [...ifUserDefinedTimes];
            newIfTimes[index] = true;
            setIfUserDefinedTimes(newIfTimes);
        };

        const handleUserDefinedSpeedChange = (value, index) => {
            const updatedUserDefinedSpeeds = [...userDefinedSpeeds];
            updatedUserDefinedSpeeds[index] = value;
            setUserDefinedSpeeds(updatedUserDefinedSpeeds);

            let newIfSpeeds = [...ifUserDefinedSpeeds];
            newIfSpeeds[index] = true;
            setIfUserDefinedSpeeds(newIfSpeeds);
        };


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

        useEffect(() => {
                runwayIDs.forEach((id, index) => {
                if (ifUserDefinedDistances[index] && ifUserDefinedTimes[index]) {
                    const calculatedSpeed = userDefinedDistances[index] / userDefinedTimes[index];                
                    let newSpeeds = [...calculatedSpeeds];
                    newSpeeds[index] = formatnumb(calculatedSpeed);
                    setCalculatedSpeeds(newSpeeds);

                    let newShowSpeeds = [...showCalculatedSpeeds];
                    newShowSpeeds[index] = true;
                    setShowCalculatedSpeeds(newShowSpeeds);

                    // Update the other two user-defined values to calculated arrays but don't show
                    let newDistances = [...calculatedDistances];
                    newDistances[index] = userDefinedDistances[index];
                    setCalculatedDistances(newDistances);
                    let newTimes = [...calculatedTimes];
                    newTimes[index] = userDefinedTimes[index];
                    setCalculatedTimes(newTimes);

                    setIfUserDefinedDistances(prev => prev.map((val, idx) => idx === index ? false : val));
                    setIfUserDefinedTimes(prev => prev.map((val, idx) => idx === index ? false : val));

                } else if (ifUserDefinedDistances[index] && ifUserDefinedSpeeds[index]) {
                    const calculatedTime = userDefinedDistances[index] / userDefinedSpeeds[index];

                    let newTimes = [...calculatedTimes];
                    newTimes[index] = formatnumb(calculatedTime);
                    setCalculatedTimes(newTimes);

                    let newShowTimes = [...showCalculatedTimes];
                    newShowTimes[index] = true;
                    setShowCalculatedTimes(newShowTimes);

                    // Update the other two user-defined values to calculated arrays but don't show
                    let newDistances = [...calculatedDistances];
                    newDistances[index] = userDefinedDistances[index];
                    setCalculatedDistances(newDistances);
                    let newSpeeds = [...calculatedSpeeds];
                    newSpeeds[index] = userDefinedSpeeds[index];
                    setCalculatedSpeeds(newSpeeds);

                    setIfUserDefinedDistances(prev => prev.map((val, idx) => idx === index ? false : val));
                    setIfUserDefinedSpeeds(prev => prev.map((val, idx) => idx === index ? false : val));

                } else if (ifUserDefinedTimes[index] && ifUserDefinedSpeeds[index]) {
                    const calculatedDistance = userDefinedSpeeds[index] * userDefinedTimes[index];

                    let newDistances = [...calculatedDistances];
                    newDistances[index] = formatnumb(calculatedDistance);
                    setCalculatedDistances(newDistances);

                    let newShowDistances = [...showCalculatedDistances];
                    newShowDistances[index] = true;
                    setShowCalculatedDistances(newShowDistances);

                    // Update the other two user-defined values to calculated arrays but don't show
                    let newTimes = [...calculatedTimes];
                    newTimes[index] = userDefinedTimes[index];
                    setCalculatedTimes(newTimes);
                    let newSpeeds = [...calculatedSpeeds];
                    newSpeeds[index] = userDefinedSpeeds[index];
                    setCalculatedSpeeds(newSpeeds);

                    setIfUserDefinedTimes(prev => prev.map((val, idx) => idx === index ? false : val));
                    setIfUserDefinedSpeeds(prev => prev.map((val, idx) => idx === index ? false : val));
                }
            });


        }, [userDefinedDistances, userDefinedTimes, userDefinedSpeeds]);


        const handleTimeSet = (time) => {
            const newTimesArray = new Array(calculatedSpeeds.length).fill(parseFloat(time)); // Create an array filled with the new time for all runways
            setUserDefinedTimes(newTimesArray);
        };


        //Click the starting gun button function to realize motion animation



        const handleStartingGunClick = () => {
            setIsGunFired(true);
            console.log("click");

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
                activeMetrics, setActiveMetrics,

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