import { AbilityBuilder, Ability } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Role } from '../enums/role.enum';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export class Enrollment {
  id: string;
  // other properties
}

export type Subjects = 'Enrollment' | Enrollment;

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
  defineAbility(user: any) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(Ability);

    if (user.role === Role.STUDENT) {
      can(Action.Read, 'Enrollment');
      can(Action.Create, 'Enrollment');
      can(Action.Delete, 'Enrollment');
    } else if (user.role === Role.LECTURER) {
      can(Action.Read, 'Enrollment');
      can(Action.Delete, 'Enrollment');
    }

    return build();
  }
}