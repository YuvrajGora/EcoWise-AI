import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    if (confirm('Are you sure you want to reset all application data? This will clear your profile and habit logs.')) {
      localStorage.clear();
      window.location.href = window.location.pathname; // Reloads to the root page cleanly
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-12 text-center">
          <div className="p-4 mb-6 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 animate-pulse">
            <AlertTriangle className="w-12 h-12" />
          </div>
          
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl mb-3">
            Something went wrong
          </h1>
          
          <p className="max-w-md text-slate-400 text-sm mb-8">
            An unexpected error occurred while rendering this view. Your local progress is safe, but we encountered an issue.
          </p>

          {this.state.error && (
            <div className="w-full max-w-lg mb-8 p-4 bg-slate-900/60 border border-white/5 rounded-xl text-left font-mono text-xs text-red-300 overflow-auto max-h-40">
              <span className="font-semibold block text-red-400 mb-1">Error Message:</span>
              {this.state.error.toString()}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={this.handleReload}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/15"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Page</span>
            </button>
            
            <button
              onClick={this.handleReset}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-slate-300 font-medium hover:bg-slate-700 hover:text-white transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
