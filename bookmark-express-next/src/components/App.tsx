import React, { useEffect, useState } from 'react'
import { CircularProgress, Container, makeStyles } from '@material-ui/core'
import { Results } from './Results'
import { SearchBar } from './SearchBar'
import ResultsContext from '../context/ResultsContext'
import { Bookmarks } from 'webextension-polyfill-ts'
import { buildCache } from '../utils/cache-utils'

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
    const [cache, setCache] = useState({})
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        async function run() {
            if (isCacheStale) {
                console.log(777, 'Changes to bookmarks detected... rebuilding cache')
                setCache(await buildCache())
            }

            setIsLoading(false)
        }

        run()
    }, [isCacheStale])

    function updateResults(newResults: Bookmarks.BookmarkTreeNode[]) {
        setResults(newResults)
    }

    const contextValue = {
        cache,
        results,
        updateResults,
    }

    return (
        <ResultsContext.Provider value={contextValue}>
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
        </ResultsContext.Provider>
    )
}
