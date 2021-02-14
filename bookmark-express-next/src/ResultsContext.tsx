import React from 'react'
import { Bookmarks } from 'webextension-polyfill-ts'

export interface ResultsContext {
    results: Bookmarks.BookmarkTreeNode[]
    updateResults: (newResults: Bookmarks.BookmarkTreeNode[]) => void
}

const ResultsContext = React.createContext<ResultsContext>({
    results: [],
    updateResults: () => {},
})

ResultsContext.displayName = 'ResultsContext'

export default ResultsContext
