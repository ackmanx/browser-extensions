import React from 'react'
import ReactDOM from 'react-dom'
import '@fontsource/roboto'
import { browser } from 'webextension-polyfill-ts'
import md5 from 'md5'
import './index.css'
import { App } from './components/App'

async function isCacheStale() {
    const { children: bookmarks } = (await browser.bookmarks.getTree())[0]

    const freshHash = md5(JSON.stringify(bookmarks))
    const savedHash = localStorage.getItem('hash')

    return freshHash !== savedHash
}

isCacheStale().then((result) => {
    ReactDOM.render(
        <React.StrictMode>
            <App isCacheStale={result} />
        </React.StrictMode>,
        document.getElementById('root')
    )
})
