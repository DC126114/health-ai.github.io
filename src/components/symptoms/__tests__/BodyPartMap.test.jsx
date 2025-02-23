import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BodyPartMap from '../BodyPartMap';

describe('BodyPartMap Component', () => {
  const mockOnPartSelect = jest.fn();

  test('renders all body parts', () => {
    render(<BodyPartMap selectedPart={null} onPartSelect={mockOnPartSelect} />);
    expect(screen.getByText('头部')).toBeInTheDocument();
    expect(screen.getByText('胸部')).toBeInTheDocument();
    expect(screen.getByText('腹部')).toBeInTheDocument();
    expect(screen.getByText('四肢')).toBeInTheDocument();
  });

  test('clicking body part calls onPartSelect', () => {
    render(<BodyPartMap selectedPart={null} onPartSelect={mockOnPartSelect} />);
    const headButton = screen.getByRole('button', { name: /头部/ });
    fireEvent.click(headButton);
    expect(mockOnPartSelect).toHaveBeenCalledWith('head');
  });

  test('selected part has different style', () => {
    render(<BodyPartMap selectedPart="head" onPartSelect={mockOnPartSelect} />);
    const headButton = screen.getByRole('button', {
      name: (content) => content.includes('头部') && content.includes('头痛')
    });
    expect(headButton).toHaveClass('border-primary-color');
  });
}); 