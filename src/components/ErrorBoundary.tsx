import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { auth } from '../lib/firebase';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private returnToSignIn = async () => {
    try {
      await auth.signOut();
    } finally {
      window.location.replace('/');
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-500 mb-6">
              We encountered an unexpected error. You can safely return to sign in and try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Reload Application
            </button>
            <button
              onClick={this.returnToSignIn}
              className="w-full mt-3 px-6 py-3 border border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Return to Sign In
            </button>
            {this.state.error && (
              <p className="mt-5 text-xs text-gray-500 break-words">
                Diagnostic: {this.state.error.message || 'Unknown application error'}
              </p>
            )}
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
