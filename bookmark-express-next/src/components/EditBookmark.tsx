import React, { ChangeEvent, useEffect, useState } from 'react'
import { Avatar, Button, Grid, InputAdornment, makeStyles, Paper, TextField, Typography } from '@material-ui/core'
import { Bookmarks, browser, Tabs } from 'webextension-polyfill-ts'
import { FolderSelection } from './FolderSelection'

const useStyles = makeStyles((theme) => ({
    input: {
        '&.Mui-focused fieldset': {
            borderColor: '#3576CB !important',
        },
    },
    sectionSpacing: {
        marginBottom: theme.spacing(2),
    },
    paper: {
        marginTop: theme.spacing(1),
        padding: theme.spacing(2),
    },
    header: {
        paddingBottom: theme.spacing(1),
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
        <Paper className={classes.paper} elevation={3}>
            <Grid container>
                <Grid item xs={12}>
                    <Typography className={classes.header} variant='h6'>
                        Bookmark Current Page
                    </Typography>
                    <TextField
                        fullWidth
                        className={`${classes.input} ${classes.sectionSpacing}`}
                        variant='outlined'
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
                        multiline
                        className={`${classes.input} ${classes.sectionSpacing}`}
                        rows={4}
                        variant='outlined'
                        value={bookmark?.url}
                        InputLabelProps={{ shrink: true }}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => handleTextChange(event, 'url')}
                    />
                    <div className={classes.sectionSpacing}>
                        <FolderSelection />
                    </div>
                    <Button variant='contained' color='primary' onClick={handleAddBookmark}>
                        Add Bookmark
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    )
}
