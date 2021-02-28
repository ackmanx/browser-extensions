import React, { ChangeEvent, useEffect, useState } from 'react'
import { Avatar, Button, InputAdornment, makeStyles, TextField } from '@material-ui/core'
import { Bookmarks, browser, Tabs } from 'webextension-polyfill-ts'

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
    const [activeTab, setActiveTab] = useState<Tabs.Tab>()
    const [bookmark, setBookmark] = useState<Bookmarks.CreateDetails>()

    useEffect(() => {
        ;(async () => {
            const tab = (await browser.tabs.query({ active: true }))[0]

            setActiveTab(tab)

            setBookmark({
                title: tab.title,
                url: tab.url,
            })
        })()
    }, [])

    const handleTextChange = (event: ChangeEvent<HTMLInputElement>, key: string) => {
        setBookmark((prevState) => ({
            ...prevState,
            [key]: event.target.value,
        }))
    }

    const handleAddBookmark = async () => {
        if (!bookmark) return

        await browser.bookmarks.create(bookmark)

        window.close()
    }

    return (
        <>
            Bookmark Current Page
            <form noValidate className={classes.form} autoComplete='off'>
                <TextField
                    fullWidth
                    className={classes.search}
                    variant='outlined'
                    label='Title'
                    value={bookmark?.title}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <Avatar src={activeTab?.favIconUrl} />
                            </InputAdornment>
                        ),
                    }}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleTextChange(event, 'title')}
                />
                <TextField
                    fullWidth
                    className={classes.search}
                    variant='outlined'
                    label='URL'
                    value={bookmark?.url}
                    InputLabelProps={{ shrink: true }}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleTextChange(event, 'url')}
                />
                <Button variant='contained' color='primary' onClick={handleAddBookmark}>
                    Add
                </Button>
            </form>
        </>
    )
}
