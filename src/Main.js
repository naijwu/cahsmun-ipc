import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from './authentication/AuthContext';

import LogoDecal from './logo-decal.png';

const Main = (props) => {
    const { currentUser, getTokenData } = useAuthContext();
    
    const [currentHover, setCurrentHover] = useState('');

    function onHover(agency) {
        setCurrentHover(agency);
    }
    
    function onUnhover(agency) {
        setCurrentHover('');
    }

    return (
        <div className={`home ${currentHover}`}>
            <div className='left'>
                <div className='links'>
                    <Link to="/agency/aljazeera" onMouseOver={e=>onHover('aljazeera')} onMouseOut={e=>onUnhover('aljazeera')}>Al Jazeera</Link>
                    <Link to="/agency/bbc" onMouseOver={e=>onHover('bbc')} onMouseOut={e=>onUnhover('bbc')}>British Broadcasting Corporation</Link>
                    <Link to="/agency/cnn" onMouseOver={e=>onHover('cnn')} onMouseOut={e=>onUnhover('cnn')}>Cable News Network</Link>
                    <Link to="/agency/euronews" onMouseOver={e=>onHover('euronews')} onMouseOut={e=>onUnhover('euronews')}>Euronews</Link>
                    <Link to="/agency/foxnews" onMouseOver={e=>onHover('foxnews')} onMouseOut={e=>onUnhover('foxnews')}>Fox News</Link>
                    <Link to="/agency/newyorktimes" onMouseOver={e=>onHover('newyorktimes')} onMouseOut={e=>onUnhover('newyorktimes')}>New York Times</Link>
                    {/* <Link to="/agency/russiatoday" onMouseOver={e=>onHover('russiatoday')} onMouseOut={e=>onUnhover('russiatoday')}>Russia Today</Link> */}
                    <Link to="/agency/globeandmail" onMouseOver={e=>onHover('globeandmail')} onMouseOut={e=>onUnhover('globeandmail')}>The Globe and Mail</Link>
                    <Link to="/agency/theonion" onMouseOver={e=>onHover('theonion')} onMouseOut={e=>onUnhover('theonion')}>The Onion</Link>
                    <Link to="/agency/xinhua" onMouseOver={e=>onHover('xinhua')} onMouseOut={e=>onUnhover('xinhua')}>Xinhua News Agency</Link>
                    <Link to="/agency/all" className='recent'>Recent Articles</Link>
                </div>
                <div className='title'>
                    International Press Corps
                </div>
            </div>
            <div className='right'>
                <div className='action'>
                </div>
                <div className='conference'>
                    <img draggable={false} src={LogoDecal} />
                    CAHSMUN 2021
                </div>
            </div>
        </div>
    )
}

export default Main;