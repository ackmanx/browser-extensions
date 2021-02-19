import React, { useEffect, useState } from 'react'
import { Container, FormControlLabel, FormGroup, makeStyles, Paper, Switch } from '@material-ui/core'
import { getUserOptions, saveUserOptions } from '../utils/storage'
import { defaultUserOptions, UserOptionKey, UserOptions } from '../utils/options'

const useStyles = makeStyles({
    paper: {
        padding: '10px',
    },
})

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

    return isLoading ? null : (
        <Container>
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
            </Paper>
        </Container>
    )
}
