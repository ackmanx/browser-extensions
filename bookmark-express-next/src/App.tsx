import React from 'react'
import { Container } from '@material-ui/core'
import { Results } from './Results'
import { SearchBar } from './SearchBar'

export function App() {
    return (
        <Container>
            <SearchBar />
            <Results />
        </Container>
    )
}
