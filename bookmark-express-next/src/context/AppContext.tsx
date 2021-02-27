import React from 'react'
import { Bookmarks } from 'webextension-polyfill-ts'
import { Cache } from '../utils/cache'
import { UserOptions } from '../utils/options'

export type ViewMode = 'search' | 'recent' | 'add' | ''

export interface AppContextInterface {
    cache: Cache
    setCache: (cache: Cache | ((prevCache: Cache) => Cache)) => void
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
