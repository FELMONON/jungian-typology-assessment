import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DiscountCaptureCard } from '../../components/discount/DiscountCaptureCard';

const { mockNavigate } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../hooks/use-auth', () => ({
  useAuth: () => ({ user: null }),
}));

vi.mock('../../lib/analytics', () => ({
  trackEvent: vi.fn(),
  AnalyticsEvents: {
    ctaClicked: vi.fn(),
  },
}));

describe('DiscountCaptureCard', () => {
  beforeEach(() => {
    const values = new Map<string, string>();
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        clear: () => values.clear(),
        getItem: (key: string) => values.get(key) ?? null,
        key: (index: number) => Array.from(values.keys())[index] ?? null,
        removeItem: (key: string) => values.delete(key),
        setItem: (key: string, value: string) => values.set(key, String(value)),
        get length() {
          return values.size;
        },
      },
    });
    mockNavigate.mockReset();
  });

  it('continues directly through the supplied checkout handler after email capture', () => {
    localStorage.setItem('typejung_discount_capture', JSON.stringify({
      email: 'reader@example.com',
      discountCode: 'TYPEJUNG30',
      tierIntent: 'insight',
    }));
    const onCheckout = vi.fn();

    render(
      <DiscountCaptureCard
        source="results_hero_axis_save_path"
        minimal
        preferredTier="insight"
        showCheckoutButtons
        onCheckout={onCheckout}
        checkoutButtonLabel="Continue to secure checkout - CA$7"
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Continue to secure checkout - CA$7' }));

    expect(onCheckout).toHaveBeenCalledWith('insight');
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
