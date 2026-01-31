import { Action, AppAbility } from '../../auth/abilities/ability.factory';
import { PolicyHandler } from '../../auth/interfaces/policy-handler.interface';
import { Lecturer } from '../entities/lecturer.entity';

export class LecturerPolicyHandler implements PolicyHandler {
  constructor(
    private action: Action,
    private conditions?: any
  ) {}

  handle(ability: AppAbility, lecturer?: Lecturer): boolean {
    if (lecturer && this.conditions) {
      return ability.can(this.action, lecturer);
    }
    return ability.can(this.action, Lecturer);
  }
}

// Resource-specific policy handlers
export const readLecturerPolicy = new LecturerPolicyHandler(Action.Read);
export const createLecturerPolicy = new LecturerPolicyHandler(Action.Create);
export const updateLecturerPolicy = new LecturerPolicyHandler(Action.Update);
export const deleteLecturerPolicy = new LecturerPolicyHandler(Action.Delete);