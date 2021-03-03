import React from 'react'
import { OptionsPage } from './components/options-page'
import { MainPage } from './components/main-page'

interface Props {
    isMetadataStale: boolean
    page: string
}

export const App = ({ isMetadataStale, page }: Props) => {
    return page === 'options' ? <OptionsPage /> : <MainPage isMetadataStale={isMetadataStale} />
}
