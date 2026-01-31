import { Action, AppAbility } from '../../auth/abilities/ability.factory';
import { PolicyHandler } from '../../auth/interfaces/policy-handler.interface';
import { GuidanceAgenda } from '../entities/guidance-agenda.entity';

export class GuidanceAgendaPolicyHandler implements PolicyHandler {
  constructor(
    private action: Action,
    private conditions?: any
  ) {}

  handle(ability: AppAbility, agenda?: GuidanceAgenda): boolean {
    if (agenda && this.conditions) {
      return ability.can(this.action, agenda);
    }
    return ability.can(this.action, GuidanceAgenda);
  }
}

// Resource-specific policy handlers
export const readGuidanceAgendaPolicy = new GuidanceAgendaPolicyHandler(Action.Read);
export const createGuidanceAgendaPolicy = new GuidanceAgendaPolicyHandler(Action.Create);
export const updateGuidanceAgendaPolicy = new GuidanceAgendaPolicyHandler(Action.Update);
export const deleteGuidanceAgendaPolicy = new GuidanceAgendaPolicyHandler(Action.Delete);

// Conditional policies for ownership-based access
export class StudentGuidanceAgendaPolicy implements PolicyHandler {
  handle(ability: AppAbility, agenda?: GuidanceAgenda): boolean {
    if (agenda) {
      return ability.can(Action.Read, agenda);
    }
    return false; // Students cannot create or manage agendas
  }
}

export class LecturerGuidanceAgendaPolicy implements PolicyHandler {
  handle(ability: AppAbility, agenda?: GuidanceAgenda): boolean {
    if (agenda) {
      return ability.can(Action.Read, agenda) ||
             ability.can(Action.Update, agenda) ||
             ability.can(Action.Delete, agenda);
    }
    return ability.can(Action.Create, GuidanceAgenda);
  }
}

export const studentGuidanceAgendaPolicy = new StudentGuidanceAgendaPolicy();
export const lecturerGuidanceAgendaPolicy = new LecturerGuidanceAgendaPolicy();