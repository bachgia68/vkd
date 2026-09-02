import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-cream-50 px-6">
          <div className="max-w-md text-center">
            <h1 className="font-display text-2xl text-forest-900 mb-3">Đã có lỗi xảy ra</h1>
            <p className="text-forest-600 text-sm mb-6">
              Trang gặp sự cố khi hiển thị. Vui lòng tải lại trang. Nếu lỗi lặp lại, hãy liên hệ hỗ trợ.
            </p>
            <button
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/'; }}
              className="btn-gold px-6 py-3"
            >
              Về Trang Chủ
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
