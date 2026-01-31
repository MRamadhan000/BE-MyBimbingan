import { CheckPolicies } from '../../auth/decorators/check-policies.decorator';
import { readLecturerPolicy, createLecturerPolicy, updateLecturerPolicy, deleteLecturerPolicy } from './lecturer-policies';

export const LecturerRead = () => CheckPolicies(readLecturerPolicy);
export const LecturerCreate = () => CheckPolicies(createLecturerPolicy);
export const LecturerUpdate = () => CheckPolicies(updateLecturerPolicy);
export const LecturerDelete = () => CheckPolicies(deleteLecturerPolicy);