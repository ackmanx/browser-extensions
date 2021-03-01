import React, { ChangeEvent, useEffect, useState } from 'react'
import { Avatar, Button, Grid, InputAdornment, makeStyles, Paper, TextField } from '@material-ui/core'
import TreeView from '@material-ui/lab/TreeView'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import TreeItem from '@material-ui/lab/TreeItem'
import { Bookmarks, browser, Tabs } from 'webextension-polyfill-ts'
import { isFolder } from '../utils/misc'

const useStyles = makeStyles((theme) => ({
    input: {
        '&.Mui-focused fieldset': {
            borderColor: '#3576CB !important',
        },
    },
    form: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
        },
    },
    marginBottom: {
        marginBottom: theme.spacing(1),
    },
    paper: {
        marginTop: theme.spacing(1),
        padding: theme.spacing(1),
    },
}))

export function EditBookmark() {
    const classes = useStyles()
    const [activeTab, setActiveTab] = useState<Tabs.Tab>()
    const [allBookmarks, setAllBookmarks] = useState<Bookmarks.BookmarkTreeNode>()
    const [bookmark, setBookmark] = useState<Bookmarks.CreateDetails>()

    useEffect(() => {
        ;(async () => {
            const tab = (await browser.tabs.query({ active: true }))[0]

            setActiveTab(tab)
            setBookmark({
                title: tab.title,
                url: tab.url,
            })

            setAllBookmarks((await browser.bookmarks.getTree())[0])
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

    const renderFolderTree = (node: Bookmarks.BookmarkTreeNode | undefined) => {
        if (!node || !isFolder(node)) return null

        return (
            <TreeItem key={node.id} nodeId={node.id} label={node.title}>
                {Array.isArray(node.children) ? node.children.map((node) => renderFolderTree(node)) : null}
            </TreeItem>
        )
    }

    return (
        <Paper className={classes.paper} elevation={3}>
            <Grid container>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        className={`${classes.input} ${classes.marginBottom}`}
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
                        className={`${classes.input} ${classes.marginBottom}`}
                        rows={4}
                        variant='outlined'
                        value={bookmark?.url}
                        InputLabelProps={{ shrink: true }}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => handleTextChange(event, 'url')}
                    />
                    <TreeView
                        className={classes.marginBottom}
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpandIcon={<ChevronRightIcon />}
                    >
                        {renderFolderTree(allBookmarks)}
                    </TreeView>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        className={classes.marginBottom}
                        variant='contained'
                        color='primary'
                        onClick={handleAddBookmark}
                    >
                        Add Bookmark
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    )
}
