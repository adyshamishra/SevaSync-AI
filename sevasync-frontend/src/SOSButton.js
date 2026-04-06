import React, { useState, useRef } from 'react';
import axios from 'axios';

const SOSButton = () => {
    const [isPressing, setIsPressing] = useState(false);
    const [progress, setProgress] = useState(0);
    const timerRef = useRef(null);

    // 1. Function to capture and send EVERYTHING
    const triggerEmergency = async () => {
        console.log("🚨 SOS ACTIVATED!");
        
        // Get Location
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            try {
                // Request Camera/Mic and start a quick 5s recording
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
                const mediaRecorder = new MediaRecorder(stream);
                let chunks = [];

                mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
                mediaRecorder.onstop = async () => {
                    const blob = new Blob(chunks, { type: 'video/webm' });
                    const formData = new FormData();
                    formData.append('video', blob);
                    formData.append('lat', latitude);
                    formData.append('lng', longitude);

                    // Send to Backend
                    await axios.post('http://localhost:5000/api/sos/trigger', formData);
                    stream.getTracks().forEach(track => track.stop()); // Turn off camera
                    alert("Emergency Alert & Evidence Sent to Volunteers!");
                };

                mediaRecorder.start();
                setTimeout(() => mediaRecorder.stop(), 5000); // 5 second clip

            } catch (err) {
                // Fallback if camera is blocked
                await axios.post('http://localhost:5000/api/sos/trigger', { lat: latitude, lng: longitude });
                alert("Location sent! (Camera access was denied)");
            }
        });
    };

    // 2. Handle the 3-second hold logic
    const startPress = () => {
        setIsPressing(true);
        timerRef.current = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timerRef.current);
                    triggerEmergency();
                    return 100;
                }
                return prev + 2; 
            });
        }, 60); 
    };

    const stopPress = () => {
        setIsPressing(false);
        clearInterval(timerRef.current);
        setProgress(0);
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <button
                onMouseDown={startPress}
                onMouseUp={stopPress}
                onMouseLeave={stopPress}
                onTouchStart={startPress}
                onTouchEnd={stopPress}
                style={{
                    width: '160px',
                    height: '160px',
                    borderRadius: '50%',
                    backgroundColor: isPressing ? '#c0392b' : '#ff4d4d',
                    color: 'white',
                    border: 'none',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    boxShadow: isPressing ? '0 0 40px #ff4d4d' : '0 10px 20px rgba(0,0,0,0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                }}
            >
                {isPressing ? `${Math.round(progress)}%` : 'HOLD SOS'}
            </button>
            <p style={{ color: '#666', marginTop: '10px' }}>Hold for 3 seconds in an emergency</p>
        </div>
    );
};

export default SOSButton;