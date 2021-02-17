import React, { ChangeEvent, useContext } from 'react'
import { IconButton, InputAdornment, OutlinedInput } from '@material-ui/core'
import SettingsIcon from '@material-ui/icons/Settings'
import { browser } from 'webextension-polyfill-ts'
import AppContext from '../context/AppContext'
import { isFolder } from '../utils/misc'

export function SearchBar() {
    const context = useContext(AppContext)

    const handleSearch = async (event: ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value

        if (query.length <= 1) {
            context.updateResults([])
            return
        }

        const bookmarks = (await browser.bookmarks.search(query)).filter((bookmark) => !isFolder(bookmark))

        context.setQuery(query)
        context.updateResults(bookmarks)
    }

    return (
        <OutlinedInput
            fullWidth
            autoFocus
            placeholder='start typing'
            onChange={handleSearch}
            endAdornment={
                <InputAdornment position='end'>
                    <IconButton>
                        <SettingsIcon />
                    </IconButton>
                </InputAdornment>
            }
        />
    )
}
