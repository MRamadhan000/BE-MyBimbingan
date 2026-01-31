import { Action, AppAbility } from '../../auth/abilities/ability.factory';
import { PolicyHandler } from '../../auth/interfaces/policy-handler.interface';
import { Submission } from '../entities/submission.entity';

export class SubmissionPolicyHandler implements PolicyHandler {
  constructor(
    private action: Action,
    private conditions?: any
  ) {}

  handle(ability: AppAbility, submission?: Submission): boolean {
    if (submission && this.conditions) {
      return ability.can(this.action, submission);
    }
    return ability.can(this.action, Submission);
  }
}

// Resource-specific policy handlers
export const readSubmissionPolicy = new SubmissionPolicyHandler(Action.Read);
export const createSubmissionPolicy = new SubmissionPolicyHandler(Action.Create);
export const updateSubmissionPolicy = new SubmissionPolicyHandler(Action.Update);
export const submitSubmissionPolicy = new SubmissionPolicyHandler(Action.Submit);
export const reviewSubmissionPolicy = new SubmissionPolicyHandler(Action.Review);
export const approveSubmissionPolicy = new SubmissionPolicyHandler(Action.Approve);