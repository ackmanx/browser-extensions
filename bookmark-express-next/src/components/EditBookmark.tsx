import React from 'react'
import {Button, Input, makeStyles, TextField} from '@material-ui/core'
import {browser} from "webextension-polyfill-ts";

const useStyles = makeStyles((theme) => ({
    search: {
        '&.Mui-focused fieldset': {
            borderColor: '#3576CB !important',
        },
    },
    form: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
        },
    },
}))

export function EditBookmark() {
    const classes = useStyles()

    const handleAddBookmark = async () => {
        const tab = (await browser.tabs.query({active: true}))[0]
        console.log(777, tab.title)
        console.log(777, tab.url)
        console.log(777, tab.favIconUrl)
    }

    return (
        <form noValidate className={classes.form} autoComplete='off'>
            <h3>Page title here with favicon</h3>
            <TextField fullWidth className={classes.search} variant='outlined' label='Title' />
            <TextField fullWidth className={classes.search} variant='outlined' label='URL' />
            <Button variant="contained" color="primary" onClick={handleAddBookmark}>Add</Button>
        </form>
    )
}
