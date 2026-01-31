import { Injectable, Logger } from '@nestjs/common';
import { AppAbility, Action } from '../abilities/ability.factory';

@Injectable()
export class PermissionService {
  private readonly logger = new Logger(PermissionService.name);

  /**
   * Check if user has permission for specific action on entity
   */
  can(ability: AppAbility, action: Action, entityClass: any, resourceObject?: any): boolean {
    try {
      if (resourceObject) {
        return ability.can(action, resourceObject);
      }
      return ability.can(action, entityClass);
    } catch (error) {
      this.logger.error(`Permission check failed: ${error.message}`, error.stack);
      return false;
    }
  }

  /**
   * Check if user cannot perform action on entity
   */
  cannot(ability: AppAbility, action: Action, entityClass: any, resourceObject?: any): boolean {
    return !this.can(ability, action, entityClass, resourceObject);
  }

  /**
   * Get all forbidden reasons for debugging
   */
  getForbiddenReasons(ability: AppAbility): string[] {
    return ability.rules
      .filter(rule => rule.inverted)
      .map(rule => rule.reason || 'No reason provided');
  }

  /**
   * Log permission check for audit trail
   */
  logPermissionCheck(
    userId: string,
    action: Action,
    entityName: string,
    allowed: boolean,
    resourceId?: string
  ): void {
    const message = `User ${userId} ${allowed ? 'granted' : 'denied'} ${action} on ${entityName}${resourceId ? ` (${resourceId})` : ''}`;
    
    if (allowed) {
      this.logger.log(message);
    } else {
      this.logger.warn(message);
    }
  }
}