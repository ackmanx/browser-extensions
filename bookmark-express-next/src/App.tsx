import React, { useState } from 'react'
import { Container } from '@material-ui/core'
import { Results } from './Results'
import { SearchBar } from './SearchBar'
import ResultsContext from './ResultsContext'
import { Bookmarks } from 'webextension-polyfill-ts'

export function App() {
    //todo: I feel like these context things should be defined in their own functions. Maybe a hook? Can hooks have state?
    const [results, setResults] = useState<Bookmarks.BookmarkTreeNode[]>([])

    function updateResults(newResults: Bookmarks.BookmarkTreeNode[]) {
        setResults(newResults)
    }

    const contextValue = {
        results,
        updateResults,
    }

    return (
        <ResultsContext.Provider value={contextValue}>
            <Container>
                <SearchBar />
                <Results />
            </Container>
        </ResultsContext.Provider>
    )
}
