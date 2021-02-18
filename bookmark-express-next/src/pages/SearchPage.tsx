import React, { useEffect, useState } from 'react'
import { CircularProgress, Container, makeStyles } from '@material-ui/core'
import { Results } from '../components/Results'
import { SearchBar } from '../components/SearchBar'
import AppContext, { AppContextInterface } from '../context/AppContext'
import { Bookmarks } from 'webextension-polyfill-ts'
import { buildCache, Cache, defaultCache } from '../utils/cache'
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

export function SearchPage({ isCacheStale }: Props) {
    const classes = useStyles()

    // Fake defaults to appease TS. Actual defaults come from storage API and are inserted in the below useEffect
    const [cache, setCache] = useState<Cache>(defaultCache)
    const [userOptions, setUserOptions] = useState<UserOptions>(defaultUserOptions)
    const [results, setResults] = useState<Bookmarks.BookmarkTreeNode[]>([])
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
    )
}
