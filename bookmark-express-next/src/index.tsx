import '@fontsource/roboto'
import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'
import { isMetadataStale } from './utils/metadata'
import { ErrorBoundary } from './components/ErrorBoundary'

const page = new URLSearchParams(window.location.search).get('page') ?? ''

if (page === 'options') {
    document.title = 'Bookmark Express Next - Options'
} else {
    document.head.insertAdjacentHTML('beforeend', '<link rel=stylesheet href=/popup.css>')
}

isMetadataStale().then((result) => {
    ReactDOM.render(
        <React.StrictMode>
            <ErrorBoundary>
                <App isMetadataStale={result} page={page} />
            </ErrorBoundary>
        </React.StrictMode>,
        document.getElementById('react')
    )
})
