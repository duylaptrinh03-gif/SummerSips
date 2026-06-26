"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Bắt lỗi render-time trong cây component con.
 * Dùng cho các section có thể fail độc lập (product grid, order list, chatbot…).
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          className="flex flex-col items-center justify-center gap-4 p-10 rounded-3xl border text-center"
          style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
        >
          <span className="text-5xl">⚠️</span>
          <div>
            <h3 className="text-lg font-black mb-1" style={{ color: "var(--text-primary)" }}>
              Có lỗi xảy ra
            </h3>
            <p className="text-sm max-w-xs" style={{ color: "var(--text-secondary)" }}>
              {this.state.error?.message ?? "Phần này gặp sự cố. Vui lòng thử lại."}
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="px-5 py-2 rounded-xl text-sm font-bold bg-orange-500 text-white hover:bg-orange-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
