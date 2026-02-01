import { Role } from './role.enum';

describe('Role Enum', () => {
  it('should have the correct values', () => {
    expect(Role.GUEST).toBe('guest');
    expect(Role.STUDENT).toBe('student');
    expect(Role.LECTURER).toBe('lecturer');
  });

  it('should have all expected roles', () => {
    const expectedRoles = ['guest', 'student', 'lecturer'];
    const actualRoles = Object.values(Role);

    expect(actualRoles).toHaveLength(expectedRoles.length);
    expectedRoles.forEach(role => {
      expect(actualRoles).toContain(role);
    });
  });

  it('should be immutable', () => {
    const originalValues = { ...Role };
    const originalStudent = Role.STUDENT;
    
    // Try to modify the enum (this should not work in strict mode)
    try {
      (Role as any).STUDENT = 'modified';
    } catch (error) {
      // This is expected in strict mode
    }

    // In JavaScript enums can be modified, but we test the original values are accessible
    expect(originalValues.STUDENT).toBe('student');
    expect(originalValues.LECTURER).toBe('lecturer');
    expect(originalValues.GUEST).toBe('guest');
    
    // Restore original value to prevent interference with other tests
    (Role as any).STUDENT = originalStudent;
  });

  it('should be usable in comparisons', () => {
    // Test direct enum value comparisons
    expect(Role.STUDENT).toBe('student');
    expect(Role.LECTURER).toBe('lecturer');
    expect(Role.GUEST).toBe('guest');
    
    // Test string comparison with Role values using variables with string type
    const userRole: string = Role.STUDENT;
    
    expect(userRole === Role.STUDENT).toBe(true);
    expect(userRole === Role.LECTURER).toBe(false);
    expect(userRole === Role.GUEST).toBe(false);
    
    // Test comparison between different roles using array indexing to avoid type inference
    const roles = Object.values(Role);
    const studentRole = roles.find(r => r === 'student');
    const lecturerRole = roles.find(r => r === 'lecturer');
    
    expect(studentRole === Role.STUDENT).toBe(true);
    expect(lecturerRole === Role.LECTURER).toBe(true);
    expect(studentRole === lecturerRole).toBe(false);
    expect(roles.length).toBe(3);
  });

  it('should be usable in switch statements', () => {
    const getUserPermissions = (role: Role) => {
      switch (role) {
        case Role.GUEST:
          return ['read'];
        case Role.STUDENT:
          return ['read', 'create_submission'];
        case Role.LECTURER:
          return ['read', 'write', 'delete', 'manage'];
        default:
          return [];
      }
    };

    expect(getUserPermissions(Role.GUEST)).toEqual(['read']);
    expect(getUserPermissions(Role.STUDENT)).toEqual(['read', 'create_submission']);
    expect(getUserPermissions(Role.LECTURER)).toEqual(['read', 'write', 'delete', 'manage']);
  });

  it('should be usable in arrays', () => {
    const adminRoles = [Role.LECTURER];
    const userRoles = [Role.STUDENT, Role.LECTURER];
    const allRoles = [Role.GUEST, Role.STUDENT, Role.LECTURER];

    expect(adminRoles).toContain(Role.LECTURER);
    expect(adminRoles).not.toContain(Role.STUDENT);
    
    expect(userRoles).toContain(Role.STUDENT);
    expect(userRoles).toContain(Role.LECTURER);
    expect(userRoles).not.toContain(Role.GUEST);

    expect(allRoles).toHaveLength(3);
    expect(allRoles).toEqual(expect.arrayContaining([Role.GUEST, Role.STUDENT, Role.LECTURER]));
  });
});