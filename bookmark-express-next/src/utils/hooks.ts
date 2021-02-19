import { useState } from 'react'
import { Cache, defaultCache } from './cache'
import { defaultUserOptions, UserOptions } from './options'
import { Bookmarks } from 'webextension-polyfill-ts'
import { AppContextInterface } from '../context/AppContext'

export function useAppContext() {
    const [cache, setCache] = useState<Cache>(defaultCache)
    const [userOptions, setUserOptions] = useState<UserOptions>(defaultUserOptions)
    const [results, setResults] = useState<Bookmarks.BookmarkTreeNode[]>([])
    const [query, setQuery] = useState<string>('')

    const context: AppContextInterface = {
        cache,
        setCache,
        results,
        setResults,
        query,
        setQuery,
        userOptions,
        setUserOptions,
    }

    return context
}
