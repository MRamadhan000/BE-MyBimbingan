import { Action, AppAbility } from '../../auth/abilities/ability.factory';
import { PolicyHandler } from '../../auth/interfaces/policy-handler.interface';

export class ReadEnrollmentPolicyHandler implements PolicyHandler {
  handle(ability: AppAbility): boolean {
    return ability.can(Action.Read, 'Enrollment');
  }
}

export class CreateEnrollmentPolicyHandler implements PolicyHandler {
  handle(ability: AppAbility): boolean {
    return ability.can(Action.Create, 'Enrollment');
  }
}

export class DeleteEnrollmentPolicyHandler implements PolicyHandler {
  handle(ability: AppAbility): boolean {
    return ability.can(Action.Delete, 'Enrollment');
  }
}