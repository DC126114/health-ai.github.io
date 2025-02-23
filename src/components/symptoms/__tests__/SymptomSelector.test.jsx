import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SymptomSelector from '../SymptomSelector';

describe('SymptomSelector Component', () => {
  const mockOnSymptomSelect = jest.fn();

  test('renders empty state when no body part selected', () => {
    render(
      <SymptomSelector
        selectedBodyPart={null}
        selectedSymptoms={[]}
        onSymptomSelect={mockOnSymptomSelect}
      />
    );
    
    expect(screen.getByPlaceholderText('搜索症状...')).toBeInTheDocument();
    expect(screen.queryByText('头痛')).not.toBeInTheDocument();
  });

  test('shows symptoms for selected body part', () => {
    render(
      <SymptomSelector
        selectedBodyPart="head"
        selectedSymptoms={[]}
        onSymptomSelect={mockOnSymptomSelect}
      />
    );
    
    expect(screen.getByText('头痛')).toBeInTheDocument();
    expect(screen.getByText('发烧')).toBeInTheDocument();
    expect(screen.getByText('头晕')).toBeInTheDocument();
  });

  test('search filter works', () => {
    render(
      <SymptomSelector
        selectedBodyPart="head"
        selectedSymptoms={[]}
        onSymptomSelect={mockOnSymptomSelect}
      />
    );
    
    const searchInput = screen.getByPlaceholderText('搜索症状...');
    fireEvent.change(searchInput, { target: { value: '头痛' } });
    
    expect(screen.getByText('头痛')).toBeInTheDocument();
    expect(screen.queryByText('发烧')).not.toBeInTheDocument();
  });
}); 