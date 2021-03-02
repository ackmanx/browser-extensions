import React, { useEffect, useState } from 'react'
import { CircularProgress, Container, makeStyles } from '@material-ui/core'
import { Results } from '../components/Results'
import { SearchBar } from '../components/SearchBar'
import AppContext from '../context/AppContext'
import { buildCache } from '../utils/metadata'
import { getCache, getUserOptions } from '../utils/storage'
import { useAppContext } from '../utils/hooks'
import {EditBookmark} from "../components/EditBookmark";

interface Props {
    isCacheStale: boolean
}

const useStyles = makeStyles({
    loading: {
        textAlign: 'center',
        padding: '10px',
    },
})

export function SearchPage({ isCacheStale }: Props) {
    const classes = useStyles()
    const context = useAppContext()
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        ;(async () => {
            if (isCacheStale) {
                console.log(777, 'Changes to bookmarks detected... rebuilding cache')
                context.setCache(await buildCache())
            } else {
                context.setCache(await getCache())
            }

            context.setUserOptions(await getUserOptions())
            setIsLoading(false)
        })()
    }, [isCacheStale])

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
