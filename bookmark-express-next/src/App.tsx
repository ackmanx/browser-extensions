import React from 'react'
import { OptionsPage } from './pages/OptionsPage'
import { SearchPage } from './pages/SearchPage'

interface Props {
    isMetadataStale: boolean
    page: string
}

export const App = ({ isMetadataStale, page }: Props) => {
    return page === 'options' ? <OptionsPage /> : <SearchPage isMetadataStale={isMetadataStale} />
}
