import React, { ChangeEvent, useContext } from 'react'
import { TextField } from '@material-ui/core'
import { browser } from 'webextension-polyfill-ts'
import ResultsContext from './ResultsContext'

export function SearchBar() {
    const resultsContext = useContext(ResultsContext)

    const handleSearch = async (event: ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value

        if (query.length <= 1) {
            resultsContext.updateResults([])
            return
        }

        const bookmarks = await browser.bookmarks.search(query)
        resultsContext.updateResults(bookmarks)
    }

    return <TextField placeholder='start typing' variant='standard' fullWidth autoFocus onChange={handleSearch} />
}
