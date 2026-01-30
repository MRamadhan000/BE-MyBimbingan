import { AppAbility, Action } from '../abilities/ability.factory';
import { PolicyHandler } from '../interfaces/policy-handler.interface';

export abstract class BasePolicyHandler implements PolicyHandler {
  constructor(
    protected action: Action,
    protected entityClass: any,
    protected conditions?: any
  ) {}

  abstract handle(ability: AppAbility, resourceObject?: any): boolean;
}

export class ResourcePolicyHandler extends BasePolicyHandler {
  handle(ability: AppAbility, resourceObject?: any): boolean {
    if (resourceObject && this.conditions) {
      return ability.can(this.action, resourceObject);
    }
    return ability.can(this.action, this.entityClass);
  }
}

export class OwnershipPolicyHandler extends BasePolicyHandler {
  constructor(
    action: Action,
    entityClass: any,
    private ownerField: string = 'userId'
  ) {
    super(action, entityClass);
  }

  handle(ability: AppAbility, resourceObject?: any): boolean {
    if (!resourceObject) {
      return ability.can(this.action, this.entityClass);
    }

    // For ownership-based checks, pass the actual resource object
    return ability.can(this.action, resourceObject);
  }
}