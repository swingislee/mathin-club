'use client'

import React, { useState, useEffect } from 'react';
import styles from './Timer.module.css';
import { useSpeedData } from './SpeedDataContext';

function Timer() {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [userTime, setUserTime] = useState(null);
    const [remainingTime, setRemainingTime] = useState(null);
    const { handleTimeSet,handleStartingGunClick  } = useSpeedData();

    useEffect(() => {
        let interval;
        if (isActive) {
            if (userTime) {
                interval = setInterval(() => {
                    setRemainingTime(prevRemainingTime => prevRemainingTime - 1);
                    if (remainingTime <= 0) {
                        setIsActive(false);
                        clearInterval(interval);
                    }
                }, 1000);
            } else {
                interval = setInterval(() => {
                    setSeconds(prevSeconds => prevSeconds + 1);
                }, 1000);
            }
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, remainingTime, userTime]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setSeconds(0);
        setRemainingTime(null);
        setIsActive(false);
    };

    const handleUserTimeChange = (e) => {
        setUserTime(e.target.value);
        setRemainingTime(e.target.value);
        // Call the callback function with the set time
        if (handleTimeSet) {
            handleTimeSet(e.target.value);
        }
    };
    
    return (
        <div className={styles.TimeDisplayWindow}>
            <span>{userTime ? `${remainingTime}s` : `${seconds}s`}</span>
            <input
                type="number"
                placeholder="Set Time (s)"
                onChange={handleUserTimeChange}
            />
            <button onClick={toggleTimer}>
                {isActive ? 'Pause' : 'Start'}
            </button>
            <button onClick={resetTimer}>Reset</button>
        </div>
    );
}

export default Timer;