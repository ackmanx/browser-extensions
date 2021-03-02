import React from 'react'
import { Metadata } from '../utils/metadata'
import { UserOptions } from '../utils/options'
import { Node } from '../react-app-env'

export type ViewMode = 'search' | 'recent' | 'add' | ''

export interface AppContextInterface {
    metadata: Metadata
    setMetadata: (metadata: Metadata | ((prevMetadata: Metadata) => Metadata)) => void
    results: Node[]
    setResults: (newResults: Node[]) => void
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
