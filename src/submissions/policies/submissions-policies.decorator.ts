import { CheckPolicies } from '../../auth/decorators/check-policies.decorator';
import { readSubmissionPolicy, createSubmissionPolicy, updateSubmissionPolicy, submitSubmissionPolicy, reviewSubmissionPolicy, approveSubmissionPolicy } from './submissions-policies';

export const SubmissionRead = () => CheckPolicies(readSubmissionPolicy);
export const SubmissionCreate = () => CheckPolicies(createSubmissionPolicy);
export const SubmissionUpdate = () => CheckPolicies(updateSubmissionPolicy);
export const SubmissionSubmit = () => CheckPolicies(submitSubmissionPolicy);
export const SubmissionReview = () => CheckPolicies(reviewSubmissionPolicy);
export const SubmissionApprove = () => CheckPolicies(approveSubmissionPolicy);