import React from 'react'
import { TextField } from '@material-ui/core'
import { browser } from 'webextension-polyfill-ts'

export function SearchBar() {
    const something = async () => {
        const bookmarks = await browser.bookmarks.search('java')
        console.log(bookmarks)
    }

    return <TextField label='Search' variant='outlined' fullWidth autoFocus onClick={something} />
}
