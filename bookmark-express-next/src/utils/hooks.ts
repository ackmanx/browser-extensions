import { useState } from 'react'
import { Metadata, defaultMetadata } from './metadata'
import { defaultUserOptions, UserOptions } from './options'
import { Bookmarks } from 'webextension-polyfill-ts'
import {AppContextInterface, ViewMode} from '../context/AppContext'

export function useAppContext() {
    const [metadata, setMetadata] = useState<Metadata>(defaultMetadata)
    const [userOptions, setUserOptions] = useState<UserOptions>(defaultUserOptions)
    const [results, setResults] = useState<Bookmarks.BookmarkTreeNode[]>([])
    const [query, setQuery] = useState<string>('')
    const [viewMode, setViewMode] = useState<ViewMode>('')

    const context: AppContextInterface = {
        metadata,
        setMetadata,
        results,
        setResults,
        query,
        setQuery,
        userOptions,
        setUserOptions,
        viewMode,
        setViewMode,
    }

    return context
}
