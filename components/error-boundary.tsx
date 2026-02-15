"use client";

import { Component } from "react";
import Button from "@/components/ui/button";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-8">
          <h2 className="text-2xl font-semibold text-secondary-500">
            Something went wrong
          </h2>
          <p className="text-neutral-500 text-center max-w-md">
            An unexpected error occurred. Please try again or contact support if
            the problem persists.
          </p>
          <Button
            className="bg-primary-500 text-white px-6 py-3"
            onClick={this.handleReset}
          >
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
