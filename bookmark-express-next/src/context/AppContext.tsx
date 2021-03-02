import React from 'react'
import { Bookmarks } from 'webextension-polyfill-ts'
import { Metadata } from '../utils/metadata'
import { UserOptions } from '../utils/options'

export type ViewMode = 'search' | 'recent' | 'add' | ''

export interface AppContextInterface {
    metadata: Metadata
    setMetadata: (metadata: Metadata | ((prevMetadata: Metadata) => Metadata)) => void
    results: Bookmarks.BookmarkTreeNode[]
    setResults: (newResults: Bookmarks.BookmarkTreeNode[]) => void
    query: string
    setQuery: (query: string) => void
    userOptions: UserOptions
    setUserOptions: (options: UserOptions) => void
    viewMode: ViewMode
    setViewMode: (viewMode: ViewMode) => void
}

const AppContext = React.createContext<AppContextInterface>({} as AppContextInterface)

AppContext.displayName = 'ResultsContext'

export default AppContext
