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