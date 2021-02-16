import React from 'react'

export class ErrorBoundary extends React.Component {
    state: {
        error: any
        errorInfo: any
    }

    constructor(props: any) {
        super(props)
        this.state = { error: null, errorInfo: null }
    }

    componentDidCatch(error: any, errorInfo: any) {
        this.setState({
            error: error,
            errorInfo: errorInfo,
        })
    }

    render() {
        const { errorInfo, error } = this.state

        if (errorInfo) {
            return (
                <div>
                    <h2>Uh oh! I crashed.</h2>
                    <div style={{ height: '400px' }}>
                        {error && error.toString()}
                        <br />
                        {errorInfo.componentStack}
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
