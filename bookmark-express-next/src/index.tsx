import React from 'react'
import ReactDOM from 'react-dom'
import '@fontsource/roboto'
import './index.css'
import { App } from './components/App'
import { isCacheStale } from './utils/cache'
import { ErrorBoundary } from './components/ErrorBoundary'

isCacheStale().then((result) => {
    ReactDOM.render(
        <React.StrictMode>
            <ErrorBoundary>
                <App isCacheStale={result} />
            </ErrorBoundary>
        </React.StrictMode>,
        document.getElementById('root')
    )
})
