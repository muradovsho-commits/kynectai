export type { MCQ } from './ib-questions';
export { IB_QUESTIONS } from './ib-questions';
export { PE_QUESTIONS, CONSULTING_QUESTIONS, ACCOUNTING_QUESTIONS, AM_QUESTIONS, ST_QUESTIONS, ER_QUESTIONS, RE_QUESTIONS, VC_QUESTIONS } from './other-questions';

import { MCQ, IB_QUESTIONS } from './ib-questions';
import { PE_QUESTIONS, CONSULTING_QUESTIONS, ACCOUNTING_QUESTIONS, AM_QUESTIONS, ST_QUESTIONS, ER_QUESTIONS, RE_QUESTIONS, VC_QUESTIONS } from './other-questions';

export const GAME_BANKS: Record<string, MCQ[]> = {
  'Investment Banking': IB_QUESTIONS,
  'Private Equity': PE_QUESTIONS,
  'Consulting': CONSULTING_QUESTIONS,
  'Accounting & Audit': ACCOUNTING_QUESTIONS,
  'Asset Management': AM_QUESTIONS,
  'Sales & Trading': ST_QUESTIONS,
  'Equity Research': ER_QUESTIONS,
  'Real Estate': RE_QUESTIONS,
  'Venture Capital': VC_QUESTIONS,
};
