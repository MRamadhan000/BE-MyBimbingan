import { Action, AppAbility } from '../../auth/abilities/ability.factory';
import { PolicyHandler } from '../../auth/interfaces/policy-handler.interface';
import { Enrollment } from '../entities/enrollment.entity';

export class EnrollmentPolicyHandler implements PolicyHandler {
  constructor(
    private action: Action,
    private conditions?: any
  ) {}

  handle(ability: AppAbility, enrollment?: Enrollment): boolean {
    if (enrollment && this.conditions) {
      return ability.can(this.action, enrollment);
    }
    return ability.can(this.action, Enrollment);
  }
}

// Resource-specific policy handlers
export const readEnrollmentPolicy = new EnrollmentPolicyHandler(Action.Read);
export const createEnrollmentPolicy = new EnrollmentPolicyHandler(Action.Create);
export const deleteEnrollmentPolicy = new EnrollmentPolicyHandler(Action.Delete);
export const approveEnrollmentPolicy = new EnrollmentPolicyHandler(Action.Approve);

// Conditional policies for ownership-based access
export class StudentEnrollmentPolicy implements PolicyHandler {
  handle(ability: AppAbility, enrollment?: Enrollment): boolean {
    if (enrollment) {
      return ability.can(Action.Read, enrollment) || 
             ability.can(Action.Delete, enrollment);
    }
    return ability.can(Action.Create, Enrollment);
  }
}

export class LecturerEnrollmentPolicy implements PolicyHandler {
  handle(ability: AppAbility, enrollment?: Enrollment): boolean {
    if (enrollment) {
      return ability.can(Action.Read, enrollment) ||
             ability.can(Action.Delete, enrollment) ||
             ability.can(Action.Approve, enrollment);
    }
    return ability.can(Action.Read, Enrollment);
  }
}

export const studentEnrollmentPolicy = new StudentEnrollmentPolicy();
export const lecturerEnrollmentPolicy = new LecturerEnrollmentPolicy();