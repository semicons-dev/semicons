import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Icon } from '../Icon';
import { SemiconsProvider } from '../context';

describe('Smoke Tests', () => {
  it('renders without crashing', () => {
    const { container } = render(<Icon name="test:icon" spriteUrl="/test.svg" />);
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renders with size prop', () => {
    const { container } = render(<Icon name="test:icon" size={24} spriteUrl="/test.svg" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('24');
  });

  it('renders with SemiconsProvider', () => {
    const { container } = render(
      <SemiconsProvider spriteUrl="/provider.svg">
        <Icon name="test:icon" />
      </SemiconsProvider>
    );
    const useEl = container.querySelector('use');
    expect(useEl?.getAttribute('href')).toBe('/provider.svg#test:icon');
  });
});
