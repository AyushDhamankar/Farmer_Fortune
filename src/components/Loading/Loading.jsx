import React from 'react';
import LoadingImg from "../../assets/loading/tractor.gif"

const Loading = () => {
  return (
    <div className="loading-container"
    style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}>
        <img src={LoadingImg} alt="" srcset="" />
    </div>
  );
};

export default Loading;