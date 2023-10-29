'use client'
//CircleUpload.js  Control the movement of runway characters and upload skins
import React, { useEffect, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import styles from './CircleUpload.module.css';
import getCroppedImg from './cropImage';
import { useSpeedData } from './SpeedDataContext';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { Image } from 'next/dist/client/image-component';


function CircleUpload({ runwayIndex }) {
    const { handleDragStart, handleDragStop, overallDistance, useLongPress, calculatedTimes, calculatedDistances, isGunFired, setIsGunFired} = useSpeedData();
    const [image, setImage] = useState("/tools/speedometer/head.png");
    const [tempImage, setTempImage] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [showCrop, setShowCrop] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [isImageUploaded, setIsImageUploaded] = useState(false);
    const [croppedArea, setCroppedArea] = useState(null);
    const [dragStartX, setDragStartX] = useState(0); 
    const [inputHeadId] = useState(`HeadInput-${runwayIndex}`);
    const [inputVehicleId] = useState(`VehicleInput-${runwayIndex}`);   
    const [vehicleBackground, setVehicleBackground] = useState("/tools/speedometer/04-plane.png");
    const [uploadTarget, setUploadTarget] = useState(null);  // 'head' or 'vehicle'
    const [isFlipped, setIsFlipped] = useState(false);
    const [activeFlipped, setActiveFlipped] = useState(false);
    const [activeButton, setActiveButton] = useState('right'); // Default to 'right'
    const [lastX, setLastX] = useState(0);
    const [currentX, setCurrentX] = useState(0);
    const xPosition = useMotionValue(0);
    const controls = useAnimation();
    const [inputValue, setInputValue] = useState("");
    const peopleRef = useRef(null);
    const [unitPixelValue, setUnitPixelValue] = useState(null);

    useEffect(() => {
        const value = ((0.8 * window.innerWidth) - 48)/ (overallDistance);
        setUnitPixelValue(value);
    }, []);

//保留两位小数的函数组件
    function formatnumb(data) {
        const absoluteData = Math.abs(data);

        // Check if absolute data is between 0 and 1
        if (0 < absoluteData && absoluteData < 1) {
            return parseFloat(data.toPrecision(1)).toString();
        } else {
            return parseFloat(data.toFixed(1)).toString();
        }
    }


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
        () => { setUploadTarget('head'); document.getElementById(inputHeadId).click()},      // Short press function
        () => { setImage("/tools/speedometer/head.png"); setShowCrop(false); setIsImageUploaded(false) }                // Long press function
    );

    const longPressVehicle = useLongPress(
        (e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
        },
        () => {
            setVehicleBackground("/tools/speedometer/08-upload.png")
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
            if (peopleRef.current && !peopleRef.current.contains(e.target)
                // ... You can add more refs and checks for other elements
            ) {setShowMenu(false);}
        };
        if (showMenu) {document.addEventListener('click', handleClickOutside)}// Only add the listener if showMenu is true
        return () => {document.removeEventListener('click', handleClickOutside);};// Cleanup the listener
    }, [showMenu]);  // useEffect is dependent on showMenu, so it'll run whenever showMenu changes

    //组件显示当前位置
    useEffect(() => {
        const updatePosition = (value) => {
            const position = value / unitPixelValue;
            setCurrentX(position);
        };
    
        // Subscribe to xPosition's changes using the new method
        const unsubscribe = xPosition.on("change", updatePosition);
    
        // Directly call the logic when the effect runs (for changes in unitPixelValue)
        updatePosition(xPosition.get());
    
        // Cleanup the subscription when the component unmounts
        return () => unsubscribe();
    }, [xPosition, unitPixelValue]);
  

    //根据命令执行运动
    useEffect(() => {
        if (isGunFired) {
            const movementDistanceValue = (calculatedDistances[runwayIndex]);
            const durationValue = (calculatedTimes[runwayIndex]);

            const movementDistance = movementDistanceValue * unitPixelValue;
            const currentValue = xPosition.get();

            const targetX = activeButton === 'right' ? currentValue + movementDistance : currentValue - movementDistance;

            controls.start({
                x: targetX,
                transition: { duration: durationValue },
            }).then(() => {
                setIsGunFired(false);
            });
        }
    }, [isGunFired, xPosition, activeButton, calculatedDistances, calculatedTimes, unitPixelValue, runwayIndex]);


    const handlePositionInputBlur = () => {
            // If inputValue is empty, do nothing.
        if (inputValue === "") return;
        const newPosition = parseFloat(inputValue) * unitPixelValue;
        xPosition.set(newPosition);
    };
 


    return (
        <div className="absolute left-[10%] right-[10%] h-24 bg-red-400">
            <div className='absolute left-6 w-1 h-full -translate-x-1/2 bg-white'></div>
            <div className='absolute right-6 w-1 h-full translate-x-1/2 bg-white'></div>
            <motion.div
                animate={controls}
                ref={peopleRef}
                className="z-10 h-24 w-12"
                drag="x"
                style={{ x: xPosition }} // Use xPosition motionValue here
                dragConstraints={{ left: 0,right:8000 }} // This ensures the drag doesn't go beyond its start position.
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
                    setLastX(info.point.x);
                }}
                onDragEnd={(event, info) => {
                    const distancePixels = info.point.x - dragStartX;
                    const distance = distancePixels / unitPixelValue;
                    handleDragStop(runwayIndex, distance);
                    setIsFlipped(activeFlipped);
                }}
            >
                    <button
                        {...longPressHead}
                        className="w-12 h-12 rounded-full bg-white flex items-center justify-center bg-cover bg-center relative"
                        style={{ backgroundImage: `url(${image})`,transform: isFlipped ? 'scaleX(-1)' : 'scaleX(1)' }}
                        onContextMenu={handleRightClick}
                    >                
                        <input
                            id={inputHeadId}
                            type="file"
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                        />                        
                    </button>
                    <button  
                        {...longPressVehicle}
                        className='w-12 h-6 relative bg-white'
                        style={{transform: isFlipped ? 'scaleX(-1)' : 'scaleX(1)',
                        }}>
                    <img src={vehicleBackground} width={48} height={24} alt='walk'/>
                    </button>
                    {showMenu && (
                        <div className="absolute w-48 h-48 top-[-22px] left-[-75px] z-10">
                            <div className={styles.circleContainer}>
                                <button
                                    className={`${styles.circleButton}`}
                                    onClick={() => handleCircleButtonClick("/tools/speedometer/01-walk.png")}
                                >
                                    <img src="/tools/speedometer/01-walk.png" width={48} height={24} alt='walk'/>
                                </button>

                                <button
                                    className={styles.circleButton}
                                    onClick={() => handleCircleButtonClick("/tools/speedometer/02-bicycle.png")}
                                >
                                    <img src="/tools/speedometer/02-bicycle.png" width={48} height={24} alt='bicycle' />
                                </button>

                                <button
                                    className={styles.circleButton}
                                    onClick={() => handleCircleButtonClick("/tools/speedometer/03-car.png")}
                                >
                                    <img src="/tools/speedometer/03-car.png" width={48} height={24} alt='car' />
                                </button>

                                <button
                                    className={styles.circleButton}
                                    onClick={() => handleCircleButtonClick("/tools/speedometer/04-plane.png")}
                                >
                                    <img src="/tools/speedometer/04-plane.png" width={48} height={24} alt='plane' />
                                </button>

                                <button
                                    className={styles.circleButton}
                                    onClick={() => handleCircleButtonClick("/tools/speedometer/05-rocket.png")}
                                >
                                    <img src="/tools/speedometer/05-rocket.png" width={48} height={24} alt='rocket' />
                                </button>

                                <button
                                    className={styles.circleButton}
                                    onClick={() => handleCircleButtonClick("/tools/speedometer/06-cloud.png")}
                                >
                                    <img src="/tools/speedometer/06-cloud.png" width={48} height={24} alt='cloud' />
                                </button>

                                <button
                                    className={styles.circleButton}
                                    onClick={() => handleCircleButtonClick("/tools/speedometer/07-wormhole.png")}
                                >
                                    <img src="/tools/speedometer/07-wormhole.png" width={48} height={24} alt='wormhole' />
                                </button>

                                <button
                                    className={styles.circleButton}
                                    onClick={() => {
                                        setUploadTarget('vehicle');
                                        document.getElementById(inputVehicleId).click();
                                    }}
                                >
                                    <input
                                        id={inputVehicleId}
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={handleImageChange}
                                    />
                                    +
                                </button>
                            </div>
                            <div className={styles.inputContainer}>
                                <div
                                    className={`${styles.triangleButton} ${activeButton === 'left' ? styles.active : styles.inactive}`}
                                    onClick={handleDirectionLeftClick}
                                ></div>

                                <input
                                    className="flex-1 p-1 border border-gray-300 w-12"
                                    type="number"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onBlur={handlePositionInputBlur}
                                    autoFocus
                                    min={0}
                                />

                                <div
                                    className={`${styles.triangleButton} ${activeButton === 'right' ? styles.active : styles.inactive}`}
                                    onClick={handleDirectionRightClick}
                                ></div>
                            </div>
                        </div>
                    )}
                    <div className="flex w-12 h-6 bg-white dark:bg-slate-600 align-middle items-center justify-center relative cursor-grab active:cursor-grabbing">
                        {formatnumb(currentX)}
                    </div>
                </motion.div>
  
            {showCrop && (
                <div className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 w-4/5 h-4/5 flex justify-center items-center fixed">                    
                    <div className="w-72 h-72 relative overflow-hidden pb-10 z-20">
                        <Cropper
                            image={tempImage}
                            crop={crop}
                            zoom={zoom}
                            aspect={uploadTarget === 'head' ? 1 : 2}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={(croppedArea, croppedAreaPixels) => setCroppedArea(croppedAreaPixels)}
                        />
                    </div>
                    <button className="relative z-20 bg-green-500 text-white py-1 px-3 rounded mt-2" onClick={handleConfirmCrop}>Confirm Crop</button>
                    <button className="relative z-20 bg-red-500 text-white py-1 px-3 rounded mt-2 ml-2" onClick={() => { setShowCrop(false); setShowMenu(false) }}>Cancle Crop</button>
                </div>
                
            )}
        </div>
    );
}

export default CircleUpload;