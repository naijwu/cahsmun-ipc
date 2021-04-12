import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";
import ReactMarkdown from 'react-markdown';

import { useAuthContext } from './authentication/AuthContext';
import { API_URL, MONTHS, prettySwitchboard, validAgencies } from './constants';

import { ArticlesDB } from './articles';

const Agency = (props) => {

    const params = useParams();

    const { currentUser, getTokenData } = useAuthContext();
    const user = getTokenData();

    const [articles, setArticles] = useState([]);
    const [displayArticles, setDisplayArticles] = useState([]);
    const [totalArticles, setTotalArticles] = useState('');

    useEffect(() => {
        if(params.agency === 'all') {

            setArticles(ArticlesDB.sort((a,b) => (a["lastUpdated"]["$date"] < b["lastUpdated"]["$date"]) ? 1 : ((b["lastUpdated"]["$date"] < a["lastUpdated"]["$date"]) ? -1 : 0)));

        } else {

            let filteredArticles = [];

            for (let i = 0; i < ArticlesDB.length; i++) {
                if (ArticlesDB[i]['author'] === params.agency) {
                    filteredArticles.push(ArticlesDB[i]);
                }
            }
            
            setArticles(filteredArticles);
        }

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

    useEffect(() => {

        let display = [];
        let totalEnabled = 0;

        for (let i = 0; i < articles.length; i++ ) {
            if(articles[i]["enabled"] === 'true') {
                display.push(
                    <div className='article'>
                        <h2>{articles[i]["title"]}</h2>
                        <h3>
                            {(params.agency === 'all') ? (
                                <>
                                {prettySwitchboard[articles[i]["author"]]} -&nbsp;
                                </>
                            ) : ''}
                            {getTime(articles[i]["lastUpdated"]["$date"])}
                        </h3>
                        <div className='contents'>
                            <ReactMarkdown>
                                {articles[i]["content"]}
                            </ReactMarkdown>
                        </div>
                        <Link to={`/agency/${articles[i]["author"]}/article/${articles[i]["_id"]["$oid"]}`}>Read More</Link>
                    </div>
                );
                totalEnabled += 1;
            }
        }

        if(totalEnabled === 0) {
            display.push(
                <div className='empty'>
                    No Articles
                </div>
            )
        }
        
        setTotalArticles(totalEnabled);
        setDisplayArticles(display);

    }, [articles])

    return (validAgencies.includes(params.agency) || params.agency === 'all') && ((params.agency === 'all') ? (
        <div className='recent'>
            <div className='top'>
                <div className='name'>
                    All Articles
                </div>
                <div className='cahs'>
                    <Link to='/'>CAHSMUN IPC</Link>
                </div> 
            </div>
            <div className='smaller'>
                <div className='articles'>
                    {displayArticles}
                </div>
            </div>
        </div>
    ) : (
        <div className='agency'>
            <div className='top'>
                <div className='name'>
                    {prettySwitchboard[params.agency]}
                </div>
                <div className='cahs'>
                    <Link to='/'>CAHSMUN IPC</Link>
                </div> 
            </div>
            <div className='bod'>
                <div className='articles'>
                    {displayArticles}
                </div>
                <div className='divider'></div>
                <div className='info'>
                    <div className='agency-name'>
                        {prettySwitchboard[params.agency]}
                    </div>
                    <div className='agency-info'>
                        <div className='detail'>
                            <div className='key'>
                                published articles
                            </div>
                            <div className='value'>
                                {totalArticles}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ));
}

export default Agency;