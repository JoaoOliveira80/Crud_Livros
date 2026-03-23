"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 text-center">
          <span className="text-6xl font-serif italic text-primary">
            Algo deu errado.
          </span>
          <p className="max-w-md text-on-surface-60 leading-relaxed">
            Ocorreu um erro inesperado. Tente recarregar a página ou clicar no
            botão abaixo.
          </p>
          {this.state.error && (
            <code className="text-xs text-on-surface-40 bg-surface-container-low px-4 py-2 rounded-lg max-w-lg overflow-auto">
              {this.state.error.message}
            </code>
          )}
          <button onClick={this.handleReset} className="btn-primary mt-2">
            Tentar novamente
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
