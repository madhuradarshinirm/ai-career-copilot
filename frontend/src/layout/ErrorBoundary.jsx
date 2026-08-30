import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Unhandled UI error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ maxWidth: '500px', margin: '4rem auto', padding: '2rem', textAlign: 'center' }}>
          <h1>Something went wrong</h1>
          <p style={{ color: '#9a9fa8', marginBottom: '1.5rem' }}>
            An unexpected error occurred. Please refresh the page and try again.
          </p>
          <button onClick={() => window.location.assign('/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      )
    }

    return this.props.children
  }
}