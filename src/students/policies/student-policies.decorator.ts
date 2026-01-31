import { CheckPolicies } from '../../auth/decorators/check-policies.decorator';
import { readStudentPolicy, createStudentPolicy, updateStudentPolicy, deleteStudentPolicy } from './student-policies';

export const StudentRead = () => CheckPolicies(readStudentPolicy);
export const StudentCreate = () => CheckPolicies(createStudentPolicy);
export const StudentUpdate = () => CheckPolicies(updateStudentPolicy);
export const StudentDelete = () => CheckPolicies(deleteStudentPolicy);