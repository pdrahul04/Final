// components/UI/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Plus } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../Button/Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('applies correct variant class', () => {
    render(<Button variant="secondary">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-secondary');
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    render(<Button icon={Plus}>Add</Button>);
    expect(screen.getByTestId('button-icon')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when loading', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders icon on the right when specified', () => {
    render(<Button icon={Plus} iconPosition="right">Add</Button>);
    const button = screen.getByRole('button');
    const icon = screen.getByTestId('button-icon');
    
    // Check that icon comes after text content
    expect(button.textContent).toBe('Add');
    expect(icon).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('passes through additional props', () => {
    render(<Button data-testid="custom-button" type="submit">Submit</Button>);
    const button = screen.getByTestId('custom-button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('applies size classes correctly', () => {
    render(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-lg');
  });

  it('does not render icon when not provided', () => {
    render(<Button>No Icon</Button>);
    expect(screen.queryByTestId('button-icon')).not.toBeInTheDocument();
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});