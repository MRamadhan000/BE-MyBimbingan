import { Action, AppAbility } from '../../auth/abilities/ability.factory';
import { PolicyHandler } from '../../auth/interfaces/policy-handler.interface';
import { Student } from '../entities/student.entity';

export class StudentPolicyHandler implements PolicyHandler {
  constructor(
    private action: Action,
    private conditions?: any
  ) {}

  handle(ability: AppAbility, student?: Student): boolean {
    if (student && this.conditions) {
      return ability.can(this.action, student);
    }
    return ability.can(this.action, Student);
  }
}

// Resource-specific policy handlers
export const readStudentPolicy = new StudentPolicyHandler(Action.Read);
export const createStudentPolicy = new StudentPolicyHandler(Action.Create);
export const updateStudentPolicy = new StudentPolicyHandler(Action.Update);
export const deleteStudentPolicy = new StudentPolicyHandler(Action.Delete);