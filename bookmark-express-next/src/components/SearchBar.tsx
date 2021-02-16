import React, { ChangeEvent, useContext } from 'react'
import { makeStyles, TextField } from '@material-ui/core'
import { browser } from 'webextension-polyfill-ts'
import AppContext from '../context/AppContext'
import { isFolder } from '../utils/misc'

const useStyles = makeStyles({
    search: {
        '& .MuiInput-underline:after': {
            borderBottomColor: '#3576CB',
        },
    },
})

export function SearchBar() {
    const classes = useStyles()
    const context = useContext(AppContext)

    const handleSearch = async (event: ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value

        if (query.length <= 1) {
            context.updateResults([])
            return
        }

        const bookmarks = (await browser.bookmarks.search(query)).filter((bookmark) => !isFolder(bookmark))

        context.updateResults(bookmarks)
    }

    return (
        <TextField
            className={classes.search}
            fullWidth
            autoFocus
            placeholder='start typing'
            variant='standard'
            onChange={handleSearch}
        />
    )
}
