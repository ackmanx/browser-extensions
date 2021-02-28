import '@fontsource/roboto'
import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'
import { isCacheStale } from './utils/cache'
import { ErrorBoundary } from './components/ErrorBoundary'

const page = new URLSearchParams(window.location.search).get('page') ?? ''

if (page !== 'options') {
    document.head.insertAdjacentHTML('beforeend', '<link rel=stylesheet href=/popup.css>')
}

isCacheStale().then((result) => {
    ReactDOM.render(
        <React.StrictMode>
            <ErrorBoundary>
                <App isCacheStale={result} page={page} />
            </ErrorBoundary>
        </React.StrictMode>,
        document.getElementById('react')
    )
})
