import React from 'react'
import { OptionsPage } from './pages/OptionsPage'
import { SearchPage } from './pages/SearchPage'

interface Props {
    isCacheStale: boolean
    page: string
}

export const App = ({ isCacheStale, page }: Props) => {
    return page === 'options' ? <OptionsPage /> : <SearchPage isCacheStale={isCacheStale} />
}
