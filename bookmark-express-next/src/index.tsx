import React from 'react'
import ReactDOM from 'react-dom'
import '@fontsource/roboto'
import './index.css'
import { App } from './components/App'
import { isCacheStale } from './utils/cache'

isCacheStale().then((result) => {
    ReactDOM.render(
        <React.StrictMode>
            <App isCacheStale={result} />
        </React.StrictMode>,
        document.getElementById('root')
    )
})
