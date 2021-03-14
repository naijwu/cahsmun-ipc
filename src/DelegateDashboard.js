import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import { useAuthContext } from './authentication/AuthContext';
import { API_URL, MONTHS } from './constants';

const DelegateDashboard = (props) => {

    const { currentUser, getTokenData, updateCurrentUser } = useAuthContext();
    const user = getTokenData();

    const [publishedArticles, setPublishedArticles] = useState([]);
    const [displayPublished, setDisplayPublished] = useState([]);
    const [unpublishedArticles, setUnpublishedArticles] = useState([]);
    const [displayUnpublished, setDisplayUnpublished] = useState([]);

    //  Database Effect
    useEffect(() => {
        axios.get(`${API_URL}/articles/${user.username}`, {
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
        let day = date.getDate().toString().padStart(2, '0');

        return `${hours}:${minutes} ${suffix}, ${day} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
    }

    // Display Effect
    useEffect(() => {

        let displayPublished = [], displayUnpublished = [];

        // add to published
        for (let i = 0; i < publishedArticles.length; i++) {

            displayPublished.push(
                <div className='item-wrap'>
                    <Link to={`/agency/${publishedArticles[i].author}/article/${publishedArticles[i]._id}`} className='item'>
                        <div className='subtitle'>
                            Title
                        </div>
                        <div className='title'>
                            {publishedArticles[i].title}
                        </div>
                    </Link>
                    <div className='subitem'>
                        <div className='author'>
                            {getTime(publishedArticles[i].lastUpdated)}
                        </div>
                        <div className='action published'>
                            Published
                        </div>
                    </div>
                </div>
            );
        }

        // add to unpublished
        for (let i = 0; i < unpublishedArticles.length; i++) {

            displayUnpublished.push(
                <div className='item-wrap'>
                    <Link to={`/agency/${unpublishedArticles[i].author}/preview/${unpublishedArticles[i]._id}`} className='item'>
                        <div className='subtitle'>
                            Title
                        </div>
                        <div className='title'>
                            {unpublishedArticles[i].title}
                        </div>
                    </Link>
                    <div className='subitem'>
                        <div className='author'>
                            {getTime(unpublishedArticles[i].lastUpdated)}
                        </div>
                        <div className='action pending'>
                            Pending Approval
                        </div>
                    </div>
                </div>
            );
        }


        setDisplayPublished(displayPublished);
        setDisplayUnpublished(displayUnpublished);

    }, [unpublishedArticles, publishedArticles]);

    function handleLogout() {
        updateCurrentUser('');
    }

    return (user.name !== 'Staff') ? (
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
                    <div className='info-title'>{user.name}</div>
                    <div className='agency-info'>
                        <div className='detail'>
                            <div className='key'>
                                published articles
                            </div>
                            <div className='value'>
                                {publishedArticles.length}
                            </div>
                        </div>
                        <div className='detail'>
                            <div className='key'>
                                unpublished articles
                            </div>
                            <div className='value'>
                                {unpublishedArticles.length}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='divider'></div>
                <div className='articles'>
                    <div className='bar'>
                        <div className='title'>
                            All Articles
                        </div>
                        <Link className='action' to='/delegate/write'>
                            Write an Article
                        </Link>
                    </div>
                    <div className='list'>
                        {displayUnpublished}
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

export default DelegateDashboard;