import React from 'react'
import { OptionsPage } from './components/options-page/OptionsPage'
import { MainAppPage } from './pages/MainAppPage'

interface Props {
    isMetadataStale: boolean
    page: string
}

export const App = ({ isMetadataStale, page }: Props) => {
    return page === 'options' ? <OptionsPage /> : <MainAppPage isMetadataStale={isMetadataStale} />
}
