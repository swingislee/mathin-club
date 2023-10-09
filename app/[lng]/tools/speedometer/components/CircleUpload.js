//CircleUpload.js  Control the movement of runway characters and upload skins
import React, { useEffect, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import styles from './CircleUpload.module.css';
import getCroppedImg from './cropImage';
import { useSpeedData } from './SpeedDataContext';
import { motion, useAnimation, useMotionValue } from 'framer-motion';


function CircleUpload({ runwayIndex }) {
    const { handleDragStart, handleDragStop, unitPixelValue, useLongPress, calculatedTimes, calculatedDistances, isGunFired, setIsGunFired} = useSpeedData();
    const [image, setImage] = useState(null);
    const [tempImage, setTempImage] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [showCrop, setShowCrop] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [isImageUploaded, setIsImageUploaded] = useState(false);
    const [croppedArea, setCroppedArea] = useState(null);
    const [dragStartX, setDragStartX] = useState(0); 
    const [inputId] = useState(`circleUploadInput-${Date.now()}-${Math.random()}`);
    const [vehicleBackground, setVehicleBackground] = useState("");
    const [uploadTarget, setUploadTarget] = useState(null);  // 'head' or 'vehicle'
    const [isFlipped, setIsFlipped] = useState(false);
    const [activeFlipped, setActiveFlipped] = useState(false);
    const [activeButton, setActiveButton] = useState('right'); // Default to 'right'
    const [lastX, setLastX] = useState(0);
    const [currentX, setCurrentX] = useState(0);
    const xPosition = useMotionValue(0);
    const controls = useAnimation();
    const [inputValue, setInputValue] = useState("");


    function formatnumb(data) {
        const absoluteData = Math.abs(data);

        // Check if absolute data is between 0 and 1
        if (0 < absoluteData && absoluteData < 1) {
            return parseFloat(data.toPrecision(2)).toString();
        } else {
            return parseFloat(data.toFixed(2)).toString();
        }
    }

    useEffect(() => {
        const updatePosition = (value) => {
            const position = value / unitPixelValue;
            setCurrentX(position);
        };

        // Subscribe to xPosition's changes
        const unsubscribe = xPosition.onChange(updatePosition);

        // Directly call the logic when the effect runs (for changes in unitPixelValue)
        updatePosition(xPosition.get());

        // Cleanup the subscription when the component unmounts
        return () => unsubscribe();
    }, [xPosition, unitPixelValue]);


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setTempImage(reader.result);
            setShowCrop(true);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleConfirmCrop = async () => {
        if (!croppedArea) return;
        const croppedImage = await getCroppedImg(tempImage, croppedArea);
        if (uploadTarget === 'head') {
            setImage(croppedImage);
            setIsImageUploaded(true); // This ensures that the + sign is hidden after an image is uploaded for the head
        } else if (uploadTarget === 'vehicle') {
            setVehicleBackground(croppedImage);
        }
        setShowCrop(false);
    };

    const handleRightClick = (e) => {
        e.preventDefault();
    };

    const longPressHead = useLongPress(
        () => { setUploadTarget('head'); document.getElementById(inputId).click()},      // Short press function
        () => { setImage(null); setShowCrop(false); setIsImageUploaded(false) }                // Long press function
    );

    const longPressVehicle = useLongPress(
        (e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
        },
        () => {
           
        }
    );
          
    const handleDirectionLeftClick = () => {
 
        const newIsFlipped = !isFlipped;
        setIsFlipped(newIsFlipped);
        setActiveFlipped(newIsFlipped);
        setActiveButton('left');
    }



    const handleDirectionRightClick = () => {
        const newIsFlipped = !isFlipped;
        setIsFlipped(newIsFlipped);
        setActiveFlipped(newIsFlipped);

        setActiveButton('right');
        
    }

    const handleCircleButtonClick = (imgSrc) => {
        setVehicleBackground(imgSrc);
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(`.${styles.vehicle}`) &&
                !e.target.closest(`.${styles.circleContainer}`) &&
                !e.target.closest(`.${styles.triangleButton}`) &&
                !e.target.closest(`.${styles.positionInput}`)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {  // Only add the listener if showMenu is true
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);  // Cleanup the listener
        };
    }, [showMenu]);  // useEffect is dependent on showMenu, so it'll run whenever showMenu changes


    useEffect(() => {
        if (isGunFired) {
            const movementDistanceValue = (calculatedDistances[runwayIndex]);
            const durationValue = (calculatedTimes[runwayIndex]);

            const movementDistance = movementDistanceValue * unitPixelValue;
            const currentValue = currentX * unitPixelValue;

            const targetX = activeButton === 'right' ? currentValue + movementDistance : currentValue - movementDistance;

            controls.start({
                x: targetX,
                transition: { duration: durationValue },
            }).then(() => {
                setIsGunFired(false);
            });
        }
    }, [isGunFired, currentX, activeButton, calculatedDistances, calculatedTimes, unitPixelValue, runwayIndex]);


    const handlePositionInputBlur = () => {
        const newPosition = parseFloat(inputValue) * unitPixelValue;
        xPosition.set(newPosition);
    };
 

 

    return (
        <div className={styles.draggableContainer}>
            <motion.div
                animate={controls}
                className={styles.people}
                drag="x"
                style={{ x: xPosition }} // Use xPosition motionValue here
                dragConstraints={{ left: 0 }} // This ensures the drag doesn't go beyond its start position.
                dragElastic={0}
                dragMomentum={false}
                onDragStart={(event, info) => {
                    handleDragStart(runwayIndex);
                    setDragStartX(info.point.x);
                }}
                onDrag={(event, info) => {
                    if (activeButton === 'right') {
                        if (info.point.x > lastX) {
                            setIsFlipped(activeFlipped);
                        } else if (info.point.x < lastX) {
                            setIsFlipped(!activeFlipped);
                        }
                    } else if (activeButton === 'left') {
                        if (info.point.x < lastX) {
                            setIsFlipped(activeFlipped);
                        } else if (info.point.x > lastX) {
                            setIsFlipped(!activeFlipped);
                        }
                    }
                    // Update the lastX for the next comparison
                    setLastX(info.point.x);
                }}
                onDragEnd={(event, info) => {
                    const distancePixels = info.point.x - dragStartX;
                    const distance = distancePixels / unitPixelValue;
                    handleDragStop(runwayIndex, distance);
                    setIsFlipped(activeFlipped);
                    setDragStartX(info.point.x);
                }}
            >
                <div className={styles.people}>
                    <button
                        {...longPressHead}
                        className={styles.circle}
                        style={{ backgroundImage: `url(${image})` }}
                        onContextMenu={handleRightClick}
                    >
                        {!isImageUploaded && '+'}
                        <input
                            id={inputId}
                            type="file"
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                        />                        
                    </button>
                    <div>
                        <button
                        {...longPressVehicle}
                        className={styles.vehicle}
                        style={{
                            backgroundImage: `url(${vehicleBackground})`,
                            transform: isFlipped ? 'scaleX(-1)' : 'scaleX(1)'
                            }}>
                        </button>
                    </div>
                    {showMenu && (
                        <div className={styles.contextMenu}>
                            <div className={styles.circleContainer}>
                                <button
                                    className={`${styles.circleButton}`}
                                    onClick={() => handleCircleButtonClick("../img/01-walk.png")}
                                    style={{ backgroundImage: "url('../img/01-walk.png')" }}
                                ></button>

                                <button
                                    className={`${styles.circleButton}`}
                                    onClick={() => handleCircleButtonClick("../img/02-bicycle.png")}
                                    style={{ backgroundImage: "url('../img/02-bicycle.png')" }}
                                ></button>

                                <button
                                    className={`${styles.circleButton}`}
                                    onClick={() => handleCircleButtonClick("../img/03-car.png")}
                                    style={{ backgroundImage: "url('../img/03-car.png')" }}
                                ></button>

                                <button
                                    className={`${styles.circleButton}`}
                                    onClick={() => handleCircleButtonClick("../img/04-plane.png")}
                                    style={{ backgroundImage: "url('../img/04-plane.png')" }}
                                ></button>

                                <button
                                    className={`${styles.circleButton}`}
                                    onClick={() => handleCircleButtonClick("../img/05-rocket.png")}
                                    style={{ backgroundImage: "url('../img/05-rocket.png')" }}
                                ></button>

                                <button
                                    className={`${styles.circleButton}`}
                                    onClick={() => handleCircleButtonClick("../img/06-cloud.png")}
                                    style={{ backgroundImage: "url('../img/06-cloud.png')" }}
                                ></button>

                                <button
                                    className={`${styles.circleButton}`}
                                    onClick={() => handleCircleButtonClick("../img/07-wormhole.png")}
                                    style={{ backgroundImage: "url('../img/07-wormhole.png')" }}
                                ></button>

                                <button
                                    className={`${styles.circleButton}`}
                                    onClick={() => {
                                        setUploadTarget('vehicle');
                                        document.getElementById(inputId).click();
                                    }}                                  
                                >+</button>
                            </div>
                            <div className={styles.inputContainer}>
                                <div
                                    className={`${styles.triangleButton} ${activeButton === 'left' ? styles.active : styles.inactive}`}
                                    onClick={handleDirectionLeftClick}
                                ></div>

                                <input
                                    className={styles.positionInput}
                                    type="number"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onBlur={handlePositionInputBlur}
                                    autoFocus
                                />

                                <div
                                    className={`${styles.triangleButton} ${activeButton === 'right' ? styles.active : styles.inactive}`}
                                    onClick={handleDirectionRightClick}
                                ></div>
                            </div>
                        </div>
                    )}
                    <div className={styles.positon}>{formatnumb(currentX)}</div>
                </div>
            </motion.div>
  
            {showCrop && (
                <div className={styles.modalContainer}>
                    <div className={styles.cropContainer}>
                        <Cropper
                            image={tempImage}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={(croppedArea, croppedAreaPixels) => setCroppedArea(croppedAreaPixels)}
                        />
                    </div>
                    <button className="cropButton" onClick={handleConfirmCrop}>Confirm Crop</button>
                    <button className="cancleCropButton" onClick={() => { setShowCrop(false); setShowMenu(false) }}>Cancle Crop</button>
                </div>
                
            )}
        </div>
    );
}

export default CircleUpload;