import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log error info here if needed
  }

  render() {
    if (this.state.hasError) {
      return <h2 style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>Something went wrong.</h2>;
    }
    return this.props.children;
  }
} 