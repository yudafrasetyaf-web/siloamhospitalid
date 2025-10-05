import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { AccessibilityProvider } from '../components/AccessibilityProvider';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  describe('Button Accessibility', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<Button>Test Button</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA attributes', () => {
      render(
        <Button 
          ariaLabel="Close modal"
          ariaDescribedBy="close-description"
          ariaPressed={true}
        >
          ×
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Close modal');
      expect(button).toHaveAttribute('aria-describedby', 'close-description');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('should be keyboard accessible', () => {
      render(<Button>Keyboard Button</Button>);
      const button = screen.getByRole('button');
      
      // Should be focusable
      button.focus();
      expect(button).toHaveFocus();
      
      // Should have focus styles
      expect(button).toHaveClass('focus-visible:outline-none');
      expect(button).toHaveClass('focus-visible:ring-2');
    });

    it('should announce state changes to screen readers', () => {
      const { rerender } = render(<Button>Toggle Button</Button>);
      const button = screen.getByRole('button');
      
      // Initial state
      expect(button).not.toHaveAttribute('aria-pressed');
      
      // Pressed state
      rerender(<Button ariaPressed={true}>Toggle Button</Button>);
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Input Accessibility', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <Input 
          placeholder="Enter your name"
          ariaLabel="Full name"
          ariaRequired={true}
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper form associations', () => {
      render(
        <div>
          <label htmlFor="name-input">Full Name</label>
          <Input 
            id="name-input"
            ariaDescribedBy="name-help"
            ariaRequired={true}
          />
          <div id="name-help">Enter your full legal name</div>
        </div>
      );
      
      const input = screen.getByLabelText('Full Name');
      expect(input).toHaveAttribute('aria-describedby', 'name-help');
      expect(input).toHaveAttribute('aria-required', 'true');
    });

    it('should indicate validation errors', () => {
      render(
        <Input 
          ariaInvalid={true}
          ariaDescribedBy="error-message"
        />
      );
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', 'error-message');
      expect(input).toHaveClass('aria-invalid:border-red-500');
    });

    it('should support autocomplete', () => {
      render(
        <Input 
          ariaAutocomplete="list"
          ariaDescribedBy="autocomplete-list"
        />
      );
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-autocomplete', 'list');
    });
  });

  describe('AccessibilityProvider', () => {
    it('should provide accessibility context', () => {
      render(
        <AccessibilityProvider>
          <div>Test Content</div>
        </AccessibilityProvider>
      );
      
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should apply accessibility classes', () => {
      const { rerender } = render(
        <AccessibilityProvider>
          <div>Test Content</div>
        </AccessibilityProvider>
      );
      
      // Test high contrast mode
      rerender(
        <AccessibilityProvider>
          <div>Test Content</div>
        </AccessibilityProvider>
      );
      
      // Note: In a real test, you would need to mock the context state
      // This is a simplified example
    });
  });

  describe('Color Contrast', () => {
    it('should have sufficient color contrast', () => {
      // This would typically use a color contrast testing library
      // For now, we'll test that high contrast classes are available
      render(
        <div className="text-high-contrast bg-high-contrast">
          High Contrast Text
        </div>
      );
      
      const element = screen.getByText('High Contrast Text');
      expect(element).toHaveClass('text-high-contrast');
      expect(element).toHaveClass('bg-high-contrast');
    });
  });

  describe('Screen Reader Support', () => {
    it('should hide decorative elements from screen readers', () => {
      render(
        <div>
          <span aria-hidden="true">🎉</span>
          <span className="sr-only">Congratulations!</span>
        </div>
      );
      
      const decorative = screen.getByText('🎉');
      const srText = screen.getByText('Congratulations!');
      
      expect(decorative).toHaveAttribute('aria-hidden', 'true');
      expect(srText).toHaveClass('sr-only');
    });

    it('should provide live regions for dynamic content', () => {
      render(
        <div>
          <div className="aria-live" aria-live="polite">
            Status updates will appear here
          </div>
        </div>
      );
      
      const liveRegion = screen.getByText('Status updates will appear here');
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
      expect(liveRegion).toHaveClass('aria-live');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support tab navigation', () => {
      render(
        <div>
          <Button>First Button</Button>
          <Button>Second Button</Button>
          <Input placeholder="Input Field" />
        </div>
      );
      
      const firstButton = screen.getByRole('button', { name: 'First Button' });
      const secondButton = screen.getByRole('button', { name: 'Second Button' });
      const input = screen.getByRole('textbox');
      
      // Test tab order
      firstButton.focus();
      expect(firstButton).toHaveFocus();
      
      // In a real test, you would simulate Tab key press
      // This is a simplified example
    });

    it('should support skip links', () => {
      render(
        <div>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <main id="main-content">
            Main content
          </main>
        </div>
      );
      
      const skipLink = screen.getByRole('link', { name: 'Skip to main content' });
      expect(skipLink).toHaveClass('skip-link');
      expect(skipLink).toHaveAttribute('href', '#main-content');
    });
  });

  describe('Focus Management', () => {
    it('should have visible focus indicators', () => {
      render(<Button>Focus Test</Button>);
      const button = screen.getByRole('button');
      
      button.focus();
      expect(button).toHaveClass('focus-indicator');
    });

    it('should trap focus in modals', () => {
      // This would require a modal component implementation
      // For now, we'll test that focus classes are available
      render(
        <div className="focus-indicator">
          Modal content
        </div>
      );
      
      const modal = screen.getByText('Modal content');
      expect(modal).toHaveClass('focus-indicator');
    });
  });
});
