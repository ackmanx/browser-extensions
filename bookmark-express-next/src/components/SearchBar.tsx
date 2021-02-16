import React, { ChangeEvent, useContext } from 'react'
import { TextField } from '@material-ui/core'
import { browser } from 'webextension-polyfill-ts'
import AppContext from '../context/AppContext'
import { isFolder } from '../utils/misc-utils'

export function SearchBar() {
    const resultsContext = useContext(AppContext)

    const handleSearch = async (event: ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value

        if (query.length <= 1) {
            resultsContext.updateResults([])
            return
        }

        const bookmarks = (await browser.bookmarks.search(query)).filter((bookmark) => !isFolder(bookmark))

        resultsContext.updateResults(bookmarks)
    }

    return <TextField fullWidth autoFocus placeholder='start typing' variant='standard' onChange={handleSearch} />
}
