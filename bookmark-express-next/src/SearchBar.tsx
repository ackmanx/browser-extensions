import React from 'react'
import { Container, TextField } from '@material-ui/core'
import { browser } from "webextension-polyfill-ts";

export function SearchBar() {

    const something = async () => {
        const bookmarks = await browser.bookmarks.search('java')
        console.log(bookmarks)
    }

    return (
        <Container>
            <TextField label='Search' variant='outlined' autoFocus onClick={something}/>
        </Container>
    )
}
