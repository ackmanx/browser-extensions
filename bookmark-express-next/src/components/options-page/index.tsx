import React, { MouseEvent, useEffect, useState } from 'react'
import { Chip, Container, FormControlLabel, FormGroup, makeStyles, Paper, Switch, Typography } from '@material-ui/core'
import { getFavorites, getUserOptions, saveFavorites, saveUserOptions } from '../../utils/storage'
import { defaultUserOptions, UserOptionKey, UserOptions } from '../../utils/options'
import { BrowseFolders } from '../BrowseFolders'
import { Favorite, Node } from '../../react-app-env'

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
}))

export function OptionsPage() {
    const classes = useStyles()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [userOptions, setUserOptions] = useState<UserOptions>(defaultUserOptions)
    const [favoriteFolders, setFavoriteFolders] = React.useState<Favorite[]>([])

    useEffect(() => {
        ;(async () => {
            setUserOptions(await getUserOptions())
            setFavoriteFolders(await getFavorites())
            setIsLoading(false)
        })()
    }, [])

    async function handleToggleOption(option: UserOptionKey) {
        setUserOptions((prevState) => {
            const newUserOptions = {
                ...prevState,
                [option]: !prevState[option],
            }

            ;(async () => await saveUserOptions(newUserOptions))()

            return newUserOptions
        })
    }

    const handleAddFavorite = (folder: Node, event: MouseEvent<HTMLElement>) => {
        event.preventDefault()

        const folderIndex = favoriteFolders.findIndex((favoritedFolder: Favorite) => favoritedFolder.id === folder.id)

        if (folderIndex > -1) {
            return setFavoriteFolders((prevFavorites) => {
                const favorites = [...prevFavorites]
                favorites.splice(folderIndex, 1)
                return favorites
            })
        }

        setFavoriteFolders((prevFavorites) => {
            const newFavorites = [...prevFavorites, { id: folder.id, title: folder.title }]

            ;(async () => await saveFavorites(newFavorites))()

            return newFavorites
        })
    }

    const handleDeleteFavorite = (folderToDelete: Favorite) => () => {
        setFavoriteFolders((prevFavorites) => {
            const newFavorites = prevFavorites.filter((favorite) => favorite.id !== folderToDelete.id)

            ;(async () => await saveFavorites(newFavorites))()

            return newFavorites
        })
    }

    return isLoading ? null : (
        <Container>
            <Typography className={classes.header} variant='h3'>
                Options
            </Typography>
            <Paper elevation={3} className={classes.paper}>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch checked={userOptions.showUrls} onChange={() => handleToggleOption('showUrls')} />
                        }
                        label='Show URLs in results'
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={userOptions.showBreadcrumbs}
                                onChange={() => handleToggleOption('showBreadcrumbs')}
                            />
                        }
                        label='Show breadcrumbs in results'
                    />
                </FormGroup>

                <Typography className={classes.header} variant='h5'>
                    Favorites
                </Typography>
                <Paper elevation={3} component='ul' className={classes.favoritesContainer}>
                    {!favoriteFolders.length && <Typography>Select a favorite below and it will show here</Typography>}
                    {favoriteFolders.map((favorite) => (
                        <li key={favorite.id}>
                            <Chip
                                label={favorite.title}
                                onDelete={handleDeleteFavorite(favorite)}
                                className={classes.chip}
                            />
                        </li>
                    ))}
                </Paper>
                <Paper className={classes.paper} elevation={3}>
                    <BrowseFolders
                        mode='favorites'
                        favoriteFolders={favoriteFolders}
                        onFolderSelect={handleAddFavorite}
                    />
                </Paper>
            </Paper>
        </Container>
    )
}
