import React, { useState } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory
} from "react-router-dom";
import { useAuthContext } from './authentication/AuthContext';
import { API_URL } from './constants';

import MDEditor from '@uiw/react-md-editor';


const Write = (props) => {

    const { currentUser, getTokenData } = useAuthContext();
    const user = getTokenData();
    const history = useHistory();

    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    function handleSend() {
        setLoading(true);

        axios.post(`${API_URL}/article`, {
            title: title,
            content: content,
            author: user.username
        }, {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': currentUser,
            }
        }).then((response) => {
            history.push('/delegate');
        }).catch((error) => {
            if(error.response) {
                setError(`${error.response.data.message}`);
            }
            setLoading(false);
        });

        setLoading(false);
    }

    return (user && (user.name !== 'Staff')) && (
        <div className='write'>
            <div className='top'>
                <div className='name'>
                    <Link to='/'>CAHSMUN IPC</Link>
                </div>
                <div className='cahs'>
                    <Link to='/delegate'>Dashboard</Link>
                </div> 
            </div>
            <div className='editor'>
                <div className='editor-title'>
                    Write an Article
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
                    (<a target='_blank' rel='noreferrer' href='https://www.markdownguide.org/basic-syntax/'>more information</a>). 
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
                    <Link to='/delegate' className='button cancel'>
                        Cancel
                    </Link>
                    <button disabled={loading} className='button send' onClick={e=>handleSend()}>
                        Send for Approval
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Write;