import { Reflector } from '@nestjs/core';
import { Roles, ROLES_KEY } from './roles.decorator';
import { Role } from '../enums/role.enum';

// Mock class and method for testing
class TestController {
  @Roles(Role.STUDENT)
  studentOnlyMethod() {}

  @Roles(Role.LECTURER)
  lecturerOnlyMethod() {}

  @Roles(Role.STUDENT, Role.LECTURER)
  studentAndLecturerMethod() {}

  methodWithoutRoles() {}
}

describe('Roles Decorator', () => {
  let reflector: Reflector;
  let controller: TestController;

  beforeEach(() => {
    reflector = new Reflector();
    controller = new TestController();
  });

  it('should set metadata for single role', () => {
    const metadata = reflector.get(ROLES_KEY, controller.studentOnlyMethod);
    
    expect(metadata).toEqual([Role.STUDENT]);
  });

  it('should set metadata for single lecturer role', () => {
    const metadata = reflector.get(ROLES_KEY, controller.lecturerOnlyMethod);
    
    expect(metadata).toEqual([Role.LECTURER]);
  });

  it('should set metadata for multiple roles', () => {
    const metadata = reflector.get(ROLES_KEY, controller.studentAndLecturerMethod);
    
    expect(metadata).toEqual([Role.STUDENT, Role.LECTURER]);
    expect(metadata).toContain(Role.STUDENT);
    expect(metadata).toContain(Role.LECTURER);
    expect(metadata).toHaveLength(2);
  });

  it('should return undefined for methods without roles', () => {
    const metadata = reflector.get(ROLES_KEY, controller.methodWithoutRoles);
    
    expect(metadata).toBeUndefined();
  });

  it('should use the correct metadata key', () => {
    expect(ROLES_KEY).toBe('roles');
  });

  it('should work with all role types', () => {
    // Test class with all roles
    class AllRolesController {
      @Roles(Role.GUEST)
      guestMethod() {}

      @Roles(Role.STUDENT)
      studentMethod() {}

      @Roles(Role.LECTURER)
      lecturerMethod() {}

      @Roles(Role.GUEST, Role.STUDENT, Role.LECTURER)
      allRolesMethod() {}
    }

    const allRolesController = new AllRolesController();

    expect(reflector.get(ROLES_KEY, allRolesController.guestMethod)).toEqual([Role.GUEST]);
    expect(reflector.get(ROLES_KEY, allRolesController.studentMethod)).toEqual([Role.STUDENT]);
    expect(reflector.get(ROLES_KEY, allRolesController.lecturerMethod)).toEqual([Role.LECTURER]);
    expect(reflector.get(ROLES_KEY, allRolesController.allRolesMethod)).toEqual([
      Role.GUEST,
      Role.STUDENT,
      Role.LECTURER,
    ]);
  });

  it('should work when applied to class', () => {
    @Roles(Role.LECTURER)
    class LecturerOnlyController {
      someMethod() {}
    }

    const metadata = reflector.get(ROLES_KEY, LecturerOnlyController);
    expect(metadata).toEqual([Role.LECTURER]);
  });

  it('should handle empty roles array', () => {
    class EmptyRolesController {
      @Roles()
      emptyRolesMethod() {}
    }

    const emptyRolesController = new EmptyRolesController();
    const metadata = reflector.get(ROLES_KEY, emptyRolesController.emptyRolesMethod);
    
    expect(metadata).toEqual([]);
    expect(metadata).toHaveLength(0);
  });

  it('should preserve role order', () => {
    class OrderTestController {
      @Roles(Role.LECTURER, Role.STUDENT, Role.GUEST)
      orderedMethod() {}
    }

    const orderTestController = new OrderTestController();
    const metadata = reflector.get(ROLES_KEY, orderTestController.orderedMethod);
    
    expect(metadata).toEqual([Role.LECTURER, Role.STUDENT, Role.GUEST]);
    expect(metadata[0]).toBe(Role.LECTURER);
    expect(metadata[1]).toBe(Role.STUDENT);
    expect(metadata[2]).toBe(Role.GUEST);
  });

  it('should allow duplicate roles (though not recommended)', () => {
    class DuplicateRolesController {
      @Roles(Role.STUDENT, Role.STUDENT)
      duplicateRolesMethod() {}
    }

    const duplicateRolesController = new DuplicateRolesController();
    const metadata = reflector.get(ROLES_KEY, duplicateRolesController.duplicateRolesMethod);
    
    expect(metadata).toEqual([Role.STUDENT, Role.STUDENT]);
    expect(metadata).toHaveLength(2);
  });
});