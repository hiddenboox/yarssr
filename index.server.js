import express from 'express';
import React from 'react'
import { renderToNodeStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { renderStylesToNodeStream } from '@emotion/server'
import manifest from '@client/manifest.json';

import { getFooter, getHeader } from './server/html-templates.js';
import { App } from './client/App.js';

const assets = Object.values(manifest).filter(url => !url.includes('hot')).filter(url => url.endsWith('.js'))

const app = express();

app.get( /\.(js|css|map|ico)$/, express.static('./dist/client'));

app.get('*', (req, res) => {
    const app = (
        <App router={StaticRouter} />
    )

    const stream = renderToNodeStream(app).pipe(renderStylesToNodeStream())
    res.write(getHeader())
    stream.pipe(res, { end: false });
    stream.on('end', () => res.end(getFooter({ assets })))
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})