import React, { useEffect, useState } from 'react'
import { FormControlLabel, FormGroup, Switch } from '@material-ui/core'
import { getUserOptions, saveUserOptions } from '../utils/storage'
import { defaultUserOptions, UserOptions } from '../utils/options'

export function OptionsPage() {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [userOptions, setUserOptions] = useState<UserOptions>(defaultUserOptions)

    useEffect(() => {
        ;(async () => {
            setUserOptions(await getUserOptions())
            setIsLoading(false)
        })()
    }, [])

    async function handleToggleShowUrls() {
        setUserOptions((prevState) => {
            const newUserOptions = {
                ...prevState,
                showUrls: !prevState.showUrls,
            }

            ;(async () => await saveUserOptions(newUserOptions))()

            return newUserOptions
        })
    }

    async function handleToggleShowBreadcrumbs() {
        setUserOptions((prevState) => {
            const newUserOptions = {
                ...prevState,
                showBreadcrumbs: !prevState.showBreadcrumbs,
            }

            ;(async () => await saveUserOptions(newUserOptions))()

            return newUserOptions
        })
    }

    return isLoading ? null : (
        <FormGroup>
            <FormControlLabel
                control={<Switch checked={userOptions.showUrls} onChange={handleToggleShowUrls} />}
                label='Show URLs in results'
            />
            <FormControlLabel
                control={<Switch checked={userOptions.showBreadcrumbs} onChange={handleToggleShowBreadcrumbs} />}
                label='Show breadcrumbs in results'
            />
        </FormGroup>
    )
}
