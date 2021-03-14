import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory
} from "react-router-dom";

import { useAuthContext } from './authentication/AuthContext';
import { API_URL, MONTHS, prettySwitchboard, validAgencies } from './constants';

const StaffDashboard = (props) => {

    const { currentUser, getTokenData, updateCurrentUser } = useAuthContext();
    const user = getTokenData();
    const history = useHistory();

    const [publishedArticles, setPublishedArticles] = useState([]);
    const [displayPublished, setDisplayPublished] = useState([]);
    const [unpublishedArticles, setUnpublishedArticles] = useState([]);
    const [displayUnpublished, setDisplayUnpublished] = useState([]);

    const [publishedStats, setPublishedStats] = useState({});
    const [unpublishedStats, setUnpublishedStats] = useState({});
    const [displayStats, setDisplayStats] = useState([]);

    //  Database Effect
    useEffect(() => {
        axios.get(`${API_URL}/articles`, {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': currentUser,
            }
        }).then((response) => {
            let articles = response.data;

            let published = [], unpublished = [];
    
            for (let i = 0; i < articles.length; i++) {
                if(articles[i].enabled === 'true') {
                    published.push(articles[i]);
                } else {
                    unpublished.push(articles[i]);
                }
            }
    
            setPublishedArticles(published);
            setUnpublishedArticles(unpublished);

        }).catch((error) => {
            console.log(error);
        });

    }, []);

    // delete article
    function handleDelete(article_id) {
        axios.delete(`${API_URL}/article/${article_id}`, {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': currentUser,
            }
        }).then((response) => {
            history.go(0);
        }).catch((error) => {
            console.log(error);
        });
    }

    // approve article
    function handleApprove(article_id) {
        axios.patch(`${API_URL}/article/${article_id}`, {
            enabled: 'true',
        }, {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': currentUser,
            }
        }).then((response) => {
            history.go(0);
        }).catch((error) => {
            console.log(error);
        });
    }

    // approve article
    function handleUnapprove(article_id) {
        axios.patch(`${API_URL}/article/${article_id}`, {
            enabled: 'false',
        }, {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': currentUser,
            }
        }).then((response) => {
            history.go(0);
        }).catch((error) => {
            console.log(error);
        });
    }

    function getTime(lastUpdated) {
        let date = new Date(lastUpdated);
        let hours = 0;
        let fullhours = date.getHours();
        let suffix = '';

        if(fullhours >= 12) {
            // afternoon
            hours = fullhours - 12;
            suffix = 'PM';
        } else {
            suffix = 'AM';
        }

        hours = hours.toString().padStart(2, '0');
        let minutes = date.getMinutes().toString().padStart(2, '0');
        let day = date.getDay().toString().padStart(2, '0');

        return `${hours}:${minutes} ${suffix}, ${day} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
    }

    // Display Effect
    useEffect(() => {

        let displayPublished = [], displayUnpublished = [];

        let statsUnpublished = {
            aljazeera: 0,
            bbc: 0,
            cnn: 0,
            euronews: 0,
            foxnews: 0,
            nyt: 0,
            russiatoday: 0,
            globeandmail: 0,
            theonion: 0,
            xinhua: 0,
        }

        let statsPublished = {
            aljazeera: 0,
            bbc: 0,
            cnn: 0,
            euronews: 0,
            foxnews: 0,
            nyt: 0,
            russiatoday: 0,
            globeandmail: 0,
            theonion: 0,
            xinhua: 0,
        }

        // add to published
        for (let i = 0; i < publishedArticles.length; i++) {
            displayPublished.push(
                <div className='item-wrap'>
                    <div className='item'>
                        <div className='subtitle'>
                            Title
                        </div>
                        <div className='title'>
                            {publishedArticles[i].title}
                        </div>
                    </div>
                    <div className='subitem'>
                        <div className='author'>
                            {prettySwitchboard[publishedArticles[i].author]} - {getTime(publishedArticles[i].lastUpdated)}
                        </div>
                        <div className='action'>
                            <Link to={`/staff/edit/${publishedArticles[i]._id}`} className='edit'>
                                Edit
                            </Link>
                            <div onClick={e=>handleUnapprove(publishedArticles[i]._id)} className='unapprove'>
                                Unapprove
                            </div>
                            <div onClick={e=>handleDelete(publishedArticles[i]._id)} className='delete'>
                                Delete
                            </div>
                        </div>
                    </div>
                </div>
            );

            statsPublished[publishedArticles[i].author] = statsPublished[publishedArticles[i].author] + 1;
        }
        if(publishedArticles.length === 0) {
            displayPublished.push(
                <div className='empty'>
                    No Articles
                </div>
            )
        }

        // add to unpublished
        for (let i = 0; i < unpublishedArticles.length; i++) {
            displayUnpublished.push(
                <div className='item-wrap'>
                    <div className='item'>
                        <div className='subtitle'>
                            Title
                        </div>
                        <div className='title'>
                            {unpublishedArticles[i].title}
                        </div>
                    </div>
                    <div className='subitem'>
                        <div className='author'>
                            {prettySwitchboard[unpublishedArticles[i].author]} - {getTime(unpublishedArticles[i].lastUpdated)}
                        </div>
                        <div className='action'>
                            <div className='approve' onClick={e=>handleApprove(unpublishedArticles[i]._id)}>
                                Approve
                            </div>
                            <div onClick={e=>handleDelete(unpublishedArticles[i]._id)} className='delete'>
                                Delete
                            </div>
                        </div>
                    </div>
                </div>
            );
            
            statsUnpublished[unpublishedArticles[i].author] = statsUnpublished[unpublishedArticles[i].author] + 1;
        }
        if(unpublishedArticles.length === 0) {
            displayUnpublished.push(
                <div className='empty'>
                    No Articles
                </div>
            )
        }


        setDisplayPublished(displayPublished);
        setDisplayUnpublished(displayUnpublished);

        setPublishedStats(statsPublished);
        setUnpublishedStats(statsUnpublished);

    }, [unpublishedArticles, publishedArticles]);

    useEffect(() => {
        let return_val = [];
        const append = [
            <div className='detail-divider'>

            </div>,
            <div className='detail'>
                <div className='key'>
                    Total Published
                </div>
                <div className='value'>
                    {publishedArticles.length}
                </div>
            </div>,
            <div className='detail'>
               <div className='key'>
                   Total Pending Publication
               </div>
               <div className='value'>
                   {unpublishedArticles.length}
               </div>
           </div>
        ]


        for (let i = 0; i < validAgencies.length; i++) {
            return_val.push(
                <div className='detail'>
                    <div className='key'>
                        {prettySwitchboard[validAgencies[i]]}
                    </div>
                    <div className='value'>
                        {publishedStats[validAgencies[i]]}
                        /
                        {publishedStats[validAgencies[i]] + unpublishedStats[validAgencies[i]]}
                    </div>
                </div>
            );
        }

        return_val.push(append);


        setDisplayStats(return_val);

    } , [publishedArticles, unpublishedArticles])

    function handleLogout() {
        updateCurrentUser('');
    }

    return (user.name === 'Staff') ? (
        <div className='staff'>
            <div className='top'>
                <div className='name'>
                    <Link to='/'>CAHSMUN IPC</Link>
                </div>
                <div className='cahs'>
                    <div onClick={e=>handleLogout()} className='logout'>Logout</div>
                </div> 
            </div>
            <div className='dash'>
                <div className='info'>
                    <div className='info-title'>Agency Publications</div>
                    <div className='agency-info'>
                        {displayStats}
                    </div>
                </div>
                <div className='divider'></div>
                <div className='articles'>
                    <div className='articles-title'>Unpublished Articles</div>
                    <div className='list'>
                        {displayUnpublished}
                    </div>
                    <div className='articles-title'>Published Articles</div>
                    <div className='list'>
                        {displayPublished}
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className='already'>
            You're not supposed to be here &mdash;&nbsp;<Link to='/'>Back home</Link>.
        </div>
    );
}

export default StaffDashboard;