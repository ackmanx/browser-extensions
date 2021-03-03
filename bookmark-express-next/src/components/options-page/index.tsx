import React, { useEffect, useState, MouseEvent } from 'react'
import { Chip, Container, FormControlLabel, FormGroup, makeStyles, Paper, Switch, Typography } from '@material-ui/core'
import { getUserOptions, saveUserOptions } from '../../utils/storage'
import { defaultUserOptions, UserOptionKey, UserOptions } from '../../utils/options'
import { BrowseFolders } from '../BrowseFolders'
import { Node } from '../../react-app-env'

const useStyles = makeStyles((theme) => ({
    header: {
        margin: theme.spacing(2, 0),
    },
    paper: {
        padding: theme.spacing(2),
    },
    favoritesContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(0.5),
        margin: theme.spacing(2, 0),
        minHeight: '45px',
        color: 'gray',
    },
    chip: {
        margin: theme.spacing(0.5),
    },
    treeItem: {
        '& .MuiTreeItem-label': {
            display: 'flex',
            alignItems: 'center',
        },
    },
}))

export function OptionsPage() {
    const classes = useStyles()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [userOptions, setUserOptions] = useState<UserOptions>(defaultUserOptions)

    useEffect(() => {
        ;(async () => {
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

    const handleFolderSelect = (folder: Node, event: MouseEvent<HTMLElement>) => {
        event.preventDefault()

        const folderIndex = chipData.findIndex((favoritedFolder: any) => {
            return favoritedFolder.key === folder.id
        })

        if (folderIndex > -1) {
            return setChipData((prevChips) => {
                const chips = [...prevChips]
                chips.splice(folderIndex, 1)
                return chips
            })
        }

        setChipData((chips) => [...chips, { key: folder.id, label: folder.title }])
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
                <Paper elevation={3} component='ul' className={classes.favoritesContainer}>
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
                    <BrowseFolders mode='favorites' onFolderSelect={handleFolderSelect} />
                </Paper>
            </Paper>
        </Container>
    )
}
