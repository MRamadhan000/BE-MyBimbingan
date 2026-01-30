import { CanActivate, ExecutionContext, Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory, AppAbility } from '../abilities/ability.factory';
import { CHECK_POLICIES_KEY } from '../decorators/check-policies.decorator';
import { PolicyHandler } from '../interfaces/policy-handler.interface';

@Injectable()
export class PoliciesGuard implements CanActivate {
  private readonly logger = new Logger(PoliciesGuard.name);

  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    if (policyHandlers.length === 0) {
      this.logger.debug('No policies defined for this endpoint');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const { method, url } = request;

    if (!user) {
      this.logger.warn(`Policy check failed - no user found: ${method} ${url}`);
      throw new ForbiddenException('User not authenticated');
    }

    const ability = this.abilityFactory.defineAbility(user);
    
    const isAllowed = policyHandlers.every((handler) => {
      const result = this.execPolicyHandler(handler, ability, request);
      this.logger.debug(`Policy check for ${handler.constructor.name}: ${result}`);
      return result;
    });

    if (!isAllowed) {
      this.logger.warn(
        `Access denied for user ${user.id} (${user.role}): ${method} ${url}`,
      );
      throw new ForbiddenException(
        'You do not have sufficient permissions to access this resource'
      );
    }

    this.logger.log(
      `Access granted for user ${user.id} (${user.role}): ${method} ${url}`,
    );
    return true;
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility, request: any) {
    try {
      // Pass the resource object if available in request params
      const resource = request.resource || request.params;
      return handler.handle(ability, resource);
    } catch (error) {
      this.logger.error(`Error executing policy handler: ${error.message}`, error.stack);
      return false;
    }
  }
}