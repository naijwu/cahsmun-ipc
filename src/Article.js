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

import { API_URL, MONTHS, prettySwitchboard, validAgencies } from './constants';

const Article = (props) => {
    const params = useParams();

    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [content, setContent] = useState('');

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

    useEffect(() => {
        axios.get(`${API_URL}/article/${params.article_id}`)
        .then((response) => {
            let article = response.data;

            setTitle(article.title);
            setDate(getTime(article.lastUpdated));
            setContent(article.content);
        }).catch((error) => {
            console.log(error);
        });
    }, [])

    return (validAgencies.includes(params.agency)) && (
        <div className='focus'>
            <div className='top'>
                <div className='name'>
                    <Link to={`/agency/${params.agency}`}>{prettySwitchboard[params.agency]}</Link>
                </div>
                <div className='cahs'>
                    <Link to='/'>CAHSMUN IPC</Link>
                </div> 
            </div>
            <div className='solo'>
                <h1 className='the-actual-h1-not-the-md-one'>{title}</h1>
                <h2 className='and-the-actual-h2-not-the-md-one'>{date}</h2>
                <h3>
                    <Link to={`/agency/${params.agency}`}>{prettySwitchboard[params.agency]}</Link>
                </h3>
                <div className='content-render'>
                    <ReactMarkdown>
                        {content}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    )
}

export default Article;