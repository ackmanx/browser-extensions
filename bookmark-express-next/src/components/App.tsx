import React, { useEffect, useState } from 'react'
import { CircularProgress, Container, makeStyles } from '@material-ui/core'
import { Results } from './Results'
import { SearchBar } from './SearchBar'
import AppContext, { AppContextInterface } from '../context/AppContext'
import { Bookmarks } from 'webextension-polyfill-ts'
import { buildCache, Cache, defaultCache } from '../utils/cache'
import { ErrorBoundary } from './ErrorBoundary'
import { getCache, getUserOptions } from '../utils/storage'
import { defaultUserOptions, UserOptions } from '../utils/options'

interface Props {
    isCacheStale: boolean
}

const useStyles = makeStyles({
    loading: {
        textAlign: 'center',
        padding: '10px',
    },
})

export function App({ isCacheStale }: Props) {
    const classes = useStyles()

    //todo: I feel like these context things should be defined in their own functions. Maybe a hook? Can hooks have state?
    const [results, setResults] = useState<Bookmarks.BookmarkTreeNode[]>([])
    const [cache, setCache] = useState<Cache>(defaultCache)
    const [userOptions, setUserOptions] = useState<UserOptions>(defaultUserOptions)
    const [query, setQuery] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        async function run() {
            if (isCacheStale) {
                console.log(777, 'Changes to bookmarks detected... rebuilding cache')
                setCache(await buildCache())
            } else {
                setCache(await getCache())
            }

            setUserOptions(await getUserOptions())
            setIsLoading(false)
        }

        run()
    }, [isCacheStale])

    function updateResults(newResults: Bookmarks.BookmarkTreeNode[]) {
        setResults(newResults)
    }

    const context: AppContextInterface = {
        cache,
        results,
        updateResults,
        query,
        setQuery,
        userOptions,
        setUserOptions,
    }

    return (
        <ErrorBoundary>
            <AppContext.Provider value={context}>
                {isLoading && (
                    <Container disableGutters className={classes.loading}>
                        <CircularProgress />
                    </Container>
                )}
                {!isLoading && (
                    <Container disableGutters>
                        <SearchBar />
                        <Results />
                    </Container>
                )}
            </AppContext.Provider>
        </ErrorBoundary>
    )
}
