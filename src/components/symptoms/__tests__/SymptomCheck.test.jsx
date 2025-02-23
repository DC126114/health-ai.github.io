import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SymptomCheck from '../../../pages/SymptomCheck';

// 测试症状评估页面的主要功能
describe('SymptomCheck Page', () => {
  beforeEach(() => {
    render(<SymptomCheck />);
  });

  // 测试页面标题渲染
  test('renders page title', () => {
    expect(screen.getByText('症状评估')).toBeInTheDocument();
  });

  // 测试身体部位选择功能
  test('body part selection works', () => {
    // 点击头部选项
    const headButton = screen.getByText('头部');
    fireEvent.click(headButton);
    
    // 验证头部相关症状是否显示
    expect(screen.getByText('头痛')).toBeInTheDocument();
    expect(screen.getByText('发烧')).toBeInTheDocument();
    expect(screen.getByText('头晕')).toBeInTheDocument();
  });

  // 测试症状搜索功能
  test('symptom search works', () => {
    // 先选择头部
    fireEvent.click(screen.getByText('头部'));
    
    // 搜索"头痛"
    const searchInput = screen.getByPlaceholderText('搜索症状...');
    fireEvent.change(searchInput, { target: { value: '头痛' } });
    
    // 验证搜索结果
    expect(screen.getByText('头痛')).toBeInTheDocument();
    expect(screen.queryByText('发烧')).not.toBeInTheDocument();
  });

  // 测试体征录入功能
  test('vital signs input works', () => {
    // 输入体温
    const temperatureInput = screen.getByPlaceholderText('36.5');
    fireEvent.change(temperatureInput, { target: { value: '37.5' } });
    expect(temperatureInput.value).toBe('37.5');

    // 选择持续时间
    const durationSelect = screen.getByText('请选择').parentElement;
    fireEvent.change(durationSelect, { target: { value: '1-3d' } });
    expect(durationSelect.value).toBe('1-3d');

    // 选择症状严重程度
    const severityRadio = screen.getByLabelText('中度');
    fireEvent.click(severityRadio);
    expect(severityRadio).toBeChecked();
  });
}); 