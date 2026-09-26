import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2, ShoppingBag } from 'lucide-react';

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
    console.error('KAAF App Uncaught Error:', error, errorInfo);
  }

  private handleResetDataAndReload = () => {
    try {
      localStorage.removeItem('kaaf_products');
      localStorage.removeItem('kaaf_cart');
      localStorage.removeItem('kaaf_loyalty');
      localStorage.removeItem('kaaf_orders');
      localStorage.removeItem('kaaf_branch');
      sessionStorage.clear();
    } catch (e) {
      console.error('Storage clear error:', e);
    }
    window.location.reload();
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
            
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 text-xs font-bold mb-3 border border-emerald-800">
              <ShoppingBag className="w-3.5 h-3.5" /> KAAF Cash & Carry
            </div>

            <h2 className="text-xl sm:text-2xl font-black mb-2 tracking-tight">
              Application Refresh Required
            </h2>

            <p className="text-sm text-slate-300 mb-1 font-serif" dir="rtl">
              براہ کرم ایپ کو ریفریش کریں یا ڈیٹا کلیئر کر کے دوبارہ لوڈ کریں۔
            </p>

            <p className="text-xs text-slate-400 mb-6">
              Browser cache ya purani saved state ki wajah se app render hone me rukawat ayi thi. Neeche diye gaye button par click karein.
            </p>

            {this.state.error?.message && (
              <div className="bg-slate-950/80 border border-slate-700/60 rounded-xl p-3 text-[11px] text-red-300 font-mono text-left mb-6 break-words max-h-24 overflow-y-auto">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReload}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-emerald-900/30"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>

              <button
                onClick={this.handleResetDataAndReload}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-xl text-sm transition border border-slate-600"
              >
                <Trash2 className="w-4 h-4 text-amber-400" />
                <span>Clear Cache & Reset</span>
              </button>
            </div>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
