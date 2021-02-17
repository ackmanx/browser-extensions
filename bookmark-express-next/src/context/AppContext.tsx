import React from 'react'
import { Bookmarks } from 'webextension-polyfill-ts'
import { Cache } from '../utils/cache'
import {UserOptions} from "../utils/options";

export interface AppContextInterface {
    cache: Cache
    results: Bookmarks.BookmarkTreeNode[]
    updateResults: (newResults: Bookmarks.BookmarkTreeNode[]) => void
    query: string
    setQuery: (query: string) => void
    userOptions: UserOptions
    setUserOptions: (options: UserOptions) => void
}

//I'm always providing values for the context on init, so default will never be necessary
const AppContext = React.createContext<AppContextInterface>({} as AppContextInterface)

AppContext.displayName = 'ResultsContext'

export default AppContext
