import { AppAbility } from '../abilities/ability.factory';

export interface PolicyHandler {
  handle(ability: AppAbility): boolean;
}