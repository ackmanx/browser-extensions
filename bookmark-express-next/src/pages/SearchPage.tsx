import React, { useEffect, useState } from 'react'
import { CircularProgress, Container, makeStyles } from '@material-ui/core'
import { Results } from '../components/Results'
import { SearchBar } from '../components/SearchBar'
import AppContext from '../context/AppContext'
import { buildMetadata } from '../utils/metadata'
import { getMetadata, getUserOptions } from '../utils/storage'
import { useAppContext } from '../utils/hooks'
import {EditBookmark} from "../components/EditBookmark";

interface Props {
    isMetadataStale: boolean
}

const useStyles = makeStyles({
    loading: {
        textAlign: 'center',
        padding: '10px',
    },
})

export function SearchPage({ isMetadataStale }: Props) {
    const classes = useStyles()
    const context = useAppContext()
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        ;(async () => {
            if (isMetadataStale) {
                console.log(777, 'Changes to bookmarks detected... rebuilding metadata cache')
                context.setMetadata(await buildMetadata())
            } else {
                context.setMetadata(await getMetadata())
            }

            context.setUserOptions(await getUserOptions())
            setIsLoading(false)
        })()
    }, [isMetadataStale])

    let view

    switch (context.viewMode) {
        case 'add':
            view = <EditBookmark />
            break
        case 'recent':
        case 'search':
            view = <Results />
            break
        default:
            view = null
    }

    return (
        <AppContext.Provider value={context}>
            {isLoading && (
                <Container disableGutters className={classes.loading}>
                    <CircularProgress />
                </Container>
            )}
            {!isLoading && (
                <Container disableGutters>
                    <SearchBar />
                    {view}
                </Container>
            )}
        </AppContext.Provider>
    )
}
