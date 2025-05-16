import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { Typography } from './Typography';
import { Button } from './Button';
import { TriangleAlert as AlertTriangle } from 'lucide-react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <AlertTriangle size={48} color={Colors.light.error[500]} />
          <Typography variant="h3" weight="bold" style={styles.title}>
            Something went wrong
          </Typography>
          <Typography variant="body1" color="secondary" style={styles.message}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </Typography>
          <Button
            title="Try Again"
            onPress={this.resetError}
            variant="primary"
            size="md"
            style={styles.button}
          />
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.xl,
    backgroundColor: Colors.light.background,
  },
  title: {
    marginTop: Layout.spacing.lg,
    marginBottom: Layout.spacing.sm,
  },
  message: {
    textAlign: 'center',
    marginBottom: Layout.spacing.xl,
  },
  button: {
    marginTop: Layout.spacing.md,
  },
});

export default ErrorBoundary;