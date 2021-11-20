import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom';

import { App } from './client/App';

ReactDOM.hydrate(
<React.StrictMode>
    <App router={BrowserRouter} />
</React.StrictMode>, document.getElementById('root'));