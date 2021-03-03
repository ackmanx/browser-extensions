import React, { useEffect, useState } from 'react'
import { Chip, Container, FormControlLabel, FormGroup, makeStyles, Paper, Switch, Typography } from '@material-ui/core'
import { getUserOptions, saveUserOptions } from '../utils/storage'
import { defaultUserOptions, UserOptionKey, UserOptions } from '../utils/options'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import TreeView from '@material-ui/lab/TreeView'
import { Node } from '../react-app-env'
import { getFolders, isFolder } from '../utils/misc'
import TreeItem from '@material-ui/lab/TreeItem'

const useStyles = makeStyles((theme) => ({
    header: {
        margin: theme.spacing(2, 0),
    },
    paper: {
        padding: theme.spacing(2),
    },
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(0.5),
        margin: theme.spacing(2, 0),
        minHeight: '45px',
        color: 'gray'
    },
    chip: {
        margin: theme.spacing(0.5),
    },
    browseFolders: {
        width: '100%',
    },
}))

export function OptionsPage() {
    const classes = useStyles()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [allFolders, setAllFolders] = useState<Node>()
    const [userOptions, setUserOptions] = useState<UserOptions>(defaultUserOptions)

    useEffect(() => {
        ;(async () => {
            const folders = await getFolders()
            setAllFolders(folders)

            setUserOptions(await getUserOptions())
            setIsLoading(false)
        })()
    }, [])

    const [chipData, setChipData] = React.useState<any[]>([])

    const handleDelete = (chipToDelete: any) => () => {
        setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key))
    }

    async function handleToggle(option: UserOptionKey) {
        setUserOptions((prevState) => {
            const newUserOptions = {
                ...prevState,
                [option]: !prevState[option],
            }

            ;(async () => await saveUserOptions(newUserOptions))()

            return newUserOptions
        })
    }

    const handleFolderSelect = (event: any, node: any) => {
        event.preventDefault()
        setChipData((chips) => [...chips, { key: node.id, label: node.title }])
    }

    const renderFolderTree = (node: Node | undefined) => {
        if (!node || !isFolder(node)) return null

        return (
            <TreeItem
                key={node.id}
                nodeId={node.id}
                label={node.title}
                onLabelClick={(event) => handleFolderSelect(event, node)}
            >
                {Array.isArray(node.children) ? node.children.map((node) => renderFolderTree(node)) : null}
            </TreeItem>
        )
    }

    return isLoading ? null : (
        <Container>
            <Typography className={classes.header} variant='h3'>
                Options
            </Typography>
            <Paper elevation={3} className={classes.paper}>
                <FormGroup>
                    <FormControlLabel
                        control={<Switch checked={userOptions.showUrls} onChange={() => handleToggle('showUrls')} />}
                        label='Show URLs in results'
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={userOptions.showBreadcrumbs}
                                onChange={() => handleToggle('showBreadcrumbs')}
                            />
                        }
                        label='Show breadcrumbs in results'
                    />
                </FormGroup>
                <Typography className={classes.header} variant='h5'>
                    Favorites
                </Typography>
                <Paper elevation={3} component='ul' className={classes.root}>
                    {!chipData.length && <Typography>Select a favorite below and it will show here</Typography>}
                    {chipData.map((data) => {
                        return (
                            <li key={data.key}>
                                <Chip
                                    label={data.label}
                                    onDelete={data.label === 'React' ? undefined : handleDelete(data)}
                                    className={classes.chip}
                                />
                            </li>
                        )
                    })}
                </Paper>
                <Paper className={classes.paper} elevation={3}>
                    <TreeView
                        className={classes.browseFolders}
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpandIcon={<ChevronRightIcon />}
                        defaultExpanded={['0']}
                    >
                        {renderFolderTree(allFolders?.children?.[0])}
                        {renderFolderTree(allFolders?.children?.[1])}
                        {renderFolderTree(allFolders?.children?.[2])}
                    </TreeView>
                </Paper>
            </Paper>
        </Container>
    )
}
