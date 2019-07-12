import React, { Children, ErrorInfo } from 'react';

interface ErrorBoundaryProps {}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  constructor(props: any) {
    super(props);
  }

  componentDidCatch(error: Error | null, errorInfo: ErrorInfo) {
    if (error && super.componentDidCatch) {
      // This is needed to render errors correctly in development / production
      super.componentDidCatch(error, errorInfo);
    }
  }
  render() {
    return Children.only(this.props.children);
  }
}
