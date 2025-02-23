import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import VitalSigns from '../VitalSigns';

describe('VitalSigns Component', () => {
  const mockOnChange = jest.fn();
  const defaultValues = {
    temperature: '',
    duration: '',
    severity: 'mild'
  };

  beforeEach(() => {
    render(<VitalSigns values={defaultValues} onChange={mockOnChange} />);
  });

  test('renders all form fields', () => {
    expect(screen.getByLabelText('体温 (°C)')).toBeInTheDocument();
    expect(screen.getByLabelText('症状持续时间')).toBeInTheDocument();
    expect(screen.getByText('症状严重程度')).toBeInTheDocument();
  });

  test('temperature input works', () => {
    const input = screen.getByLabelText('体温 (°C)');
    fireEvent.change(input, { target: { value: '37.5' } });
    expect(mockOnChange).toHaveBeenCalledWith({ temperature: '37.5' });
  });

  test('duration selection works', () => {
    const select = screen.getByLabelText('症状持续时间');
    fireEvent.change(select, { target: { value: '1-3d' } });
    expect(mockOnChange).toHaveBeenCalledWith({ duration: '1-3d' });
  });

  test('severity selection works', () => {
    const radio = screen.getByLabelText('中度');
    fireEvent.click(radio);
    expect(mockOnChange).toHaveBeenCalledWith({ severity: '中度' });
  });
}); 