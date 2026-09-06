import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Assessment } from '../../pages/Assessment';
import { depthQuestions } from '../../data/depthAssessment';
import { ASSESSMENT_PROGRESS_STORAGE_KEY } from '../../lib/assessment-progress';

vi.mock('../../hooks/use-auth', () => ({
  useAuth: () => ({ user: null, isLoading: false }),
}));
vi.mock('../../hooks/useAnalytics', () => ({
  useAssessmentTracking: () => ({
    trackStart: vi.fn(),
    trackProgress: vi.fn(),
    trackComplete: vi.fn(),
  }),
}));
vi.mock('../../lib/analytics', () => ({ trackEvent: vi.fn() }));

beforeEach(() => {
  for (const name of ['localStorage', 'sessionStorage']) {
    const entries = new Map<string, string>();
    vi.stubGlobal(name, {
      getItem: (key: string) => entries.get(key) ?? null,
      setItem: (key: string, value: string) => entries.set(key, String(value)),
      removeItem: (key: string) => entries.delete(key),
      clear: () => entries.clear(),
    });
  }
  window.matchMedia = vi
    .fn()
    .mockReturnValue({
      matches: false,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  window.scrollTo = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
const openAssessment = () =>
  render(
    <MemoryRouter initialEntries={['/assessment']}>
      <Assessment />
    </MemoryRouter>,
  );

describe('assessment navigation', () => {
  it('shows the first question immediately and prevents continuing without an answer', async () => {
    openAssessment();
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: depthQuestions[0].prompt }),
      ).toBeVisible(),
    );
    expect(screen.getAllByRole('group')).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'Next question' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Choose an answer');
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: depthQuestions[0].prompt }),
      ).toBeVisible(),
    );
  });

  it('keeps a selected answer when the user goes forward and back', async () => {
    openAssessment();
    const answer = screen.getAllByRole('radio')[0] as HTMLInputElement;
    const label = answer.closest('label')!.textContent!;
    fireEvent.click(answer);
    expect(answer).toBeChecked();
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: depthQuestions[0].prompt }),
      ).toBeVisible(),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Next question' }));
    await screen.findByRole('heading', { name: depthQuestions[1].prompt });
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    await screen.findByRole('heading', { name: depthQuestions[0].prompt });
    await waitFor(() =>
      expect(screen.getByRole('radio', { name: label })).toBeChecked(),
    );
  });

  it('resumes legacy desktop saves at the first unanswered question', async () => {
    const answers = Object.fromEntries(
      depthQuestions
        .slice(0, 12)
        .map((question) => [question.id, question.options[0].id]),
    );
    localStorage.setItem(
      ASSESSMENT_PROGRESS_STORAGE_KEY,
      JSON.stringify({ answers, currentPage: 2 }),
    );
    openAssessment();
    await screen.findByRole('heading', { name: depthQuestions[12].prompt });
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '12',
    );
    expect(screen.getByText(/Your 12 answers are saved/)).toBeVisible();
  });
});
