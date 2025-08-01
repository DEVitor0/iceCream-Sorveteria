import React from 'react';

class ErrorGradientLineChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', border: '1px solid red', color: 'red' }}>
          <h1>Something went wrong.</h1>
          <p>
            <strong>Error:</strong> {this.state.error?.toString()}
          </p>
          <p>
            <strong>Component Stack:</strong>
          </p>
          <pre>{this.state.errorInfo?.componentStack}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorGradientLineChart;
