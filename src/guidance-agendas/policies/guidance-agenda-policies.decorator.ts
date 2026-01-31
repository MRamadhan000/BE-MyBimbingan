import { CheckPolicies } from '../../auth/decorators/check-policies.decorator';
import { readGuidanceAgendaPolicy, createGuidanceAgendaPolicy, updateGuidanceAgendaPolicy, deleteGuidanceAgendaPolicy } from './guidance-agenda-policies';

export const GuidanceAgendaRead = () => CheckPolicies(readGuidanceAgendaPolicy);
export const GuidanceAgendaCreate = () => CheckPolicies(createGuidanceAgendaPolicy);
export const GuidanceAgendaUpdate = () => CheckPolicies(updateGuidanceAgendaPolicy);
export const GuidanceAgendaDelete = () => CheckPolicies(deleteGuidanceAgendaPolicy);