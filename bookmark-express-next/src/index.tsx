import React from 'react'
import ReactDOM from 'react-dom'
import '@fontsource/roboto'
import './index.css'
import { Search } from './pages/Search'
import { isCacheStale } from './utils/cache'
import { ErrorBoundary } from './components/ErrorBoundary'

const page = new URLSearchParams(window.location.search).get('page')

isCacheStale().then((result) => {
    ReactDOM.render(
        <React.StrictMode>
            <ErrorBoundary>{page === 'options' ? <h1>Options page!</h1> : <Search isCacheStale={result} />}</ErrorBoundary>
        </React.StrictMode>,
        document.getElementById('root')
    )
})
