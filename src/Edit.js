import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
  useParams
} from "react-router-dom";
import { useAuthContext } from './authentication/AuthContext';
import { API_URL } from './constants';

import MDEditor from '@uiw/react-md-editor';


const Edit = (props) => {

    const { currentUser, getTokenData } = useAuthContext();
    const user = getTokenData();
    const history = useHistory();
    const params = useParams();

    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    useEffect(() => {
        axios.get(`${API_URL}/article/${params.article_id}`)
        .then((response) => {
            let article = response.data;

            setTitle(article.title);
            setContent(article.content);
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    function handleSend() {
        setLoading(true);

        axios.patch(`${API_URL}/article/${params.article_id}`, {
            title: title,
            content: content
        }, {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': currentUser,
            }
        }).then((response) => {
            history.push('/staff');
        }).catch((error) => {
            if(error.response) {
                setError('Error');
            }
            setLoading(false);
        });

        setLoading(false);
    }

    return (user && (user.name === 'Staff')) && (
        <div className='write'>
            <div className='top'>
                <div className='name'>
                    <Link to='/'>CAHSMUN IPC</Link>
                </div>
                <div className='cahs'>
                    <Link to='/staff'>Dashboard</Link>
                </div> 
            </div>
            <div className='editor'>
                <div className='editor-title'>
                    Edit Article
                </div>
                <div className='input-group title'>
                    <div className='input-label'>
                        Article Title
                    </div>
                    <input value={title} onChange={e=>setTitle(e.target.value)} type='text' />
                </div>
                <div className='input-group'>
                    <div className='input-label'>
                        Article Content & Preview
                    </div>
                    {/* <textarea></textarea> */}
                    <div className="container">
                        <MDEditor
                            height='600px'
                            visiableDragbar={false}
                            value={content}
                            onChange={setContent}
                        />
                    </div>
                </div>
                <div className='notification'>
                    To maximize authorial features, a text editor with markdown formatting is provided 
                    (<a target='_blank' href='https://www.markdownguide.org/basic-syntax/'>more information</a>). 
                    Markdown can be ignored without consequence if it is of no use. To prevent accidental 
                    loss of work, you are encouraged to write the article using a program such as Google Docs, 
                    and have it copy and pasted to this page afterwards.
                </div>
                {(error) ? (
                    <div className='error'>
                        {error}
                    </div>
                ) : ''}
                <div className='actions'>
                    <Link to='/staff' className='button cancel'>
                        Cancel
                    </Link>
                    <button disabled={loading} className='button send' onClick={e=>handleSend()}>
                        Modify Article
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Edit;