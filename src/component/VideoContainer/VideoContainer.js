import React from 'react'
import './video-container.css'

function VideoContainer({ videoGridRef }) {

    return (
        <div className="video-container" ref={videoGridRef} />
    )
}

export default VideoContainer
