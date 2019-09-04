import React, { Children, ErrorInfo } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<{}, ErrorBoundaryState> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error | null, errorInfo: ErrorInfo) {
    if (error && super.componentDidCatch) {
      // This is needed to render errors correctly in development / production
      super.componentDidCatch(error, errorInfo);
    }
  }
  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Ups</h1>;
    }

    return Children.only(this.props.children);
  }
}
