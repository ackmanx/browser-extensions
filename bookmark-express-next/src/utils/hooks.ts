import { useState } from 'react'
import { defaultMetadata, Metadata } from './metadata'
import { defaultUserOptions, UserOptions } from './options'
import { AppContextInterface, ViewMode } from 'context/AppContext'
import { Node } from 'react-app-env'

export function useAppContext() {
    const [metadata, setMetadata] = useState<Metadata>(defaultMetadata)
    const [userOptions, setUserOptions] = useState<UserOptions>(defaultUserOptions)
    const [results, setResults] = useState<Node[]>([])
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
