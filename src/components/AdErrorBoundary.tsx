import { Component, ErrorInfo, PropsWithChildren } from 'react';

type State = { failed: boolean };

export class AdErrorBoundary extends Component<PropsWithChildren, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // Ads are optional. Rendering failures must never interrupt the host screen.
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
