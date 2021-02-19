import React, { useEffect, useState } from 'react'
import { FormControlLabel, FormGroup, Switch } from '@material-ui/core'
import { getUserOptions, saveUserOptions } from '../utils/storage'
import { defaultUserOptions, UserOptionKey, UserOptions } from '../utils/options'

export function OptionsPage() {
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
        <FormGroup>
            <FormControlLabel
                control={<Switch checked={userOptions.showUrls} onChange={() => handleToggle('showUrls')} />}
                label='Show URLs in results'
            />
            <FormControlLabel
                control={
                    <Switch checked={userOptions.showBreadcrumbs} onChange={() => handleToggle('showBreadcrumbs')} />
                }
                label='Show breadcrumbs in results'
            />
        </FormGroup>
    )
}
