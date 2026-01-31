import { CheckPolicies } from '../../auth/decorators/check-policies.decorator';
import { readEnrollmentPolicy, createEnrollmentPolicy, deleteEnrollmentPolicy } from './enrollment-policies';

export const EnrollmentRead = () => CheckPolicies(readEnrollmentPolicy);
export const EnrollmentCreate = () => CheckPolicies(createEnrollmentPolicy);
export const EnrollmentDelete = () => CheckPolicies(deleteEnrollmentPolicy);