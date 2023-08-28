import React, { useRef, useEffect } from 'react';

const VideoPlayer = ({ currentTime, src }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.currentTime = currentTime;
        }
    }, [currentTime]);

    return (
        <video ref={videoRef} controls>
            <source src={src} type="video/mp4" />
            <track kind="captions" src="path/to/captions.vtt" label="English" default />
        </video>
    );
};

export default VideoPlayer;
