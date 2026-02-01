import { validate } from 'class-validator';
import { StudentRegisterDto, StudentLoginDto } from './student-auth.dto';

describe('StudentAuthDto', () => {
  describe('StudentRegisterDto', () => {
    let dto: StudentRegisterDto;

    beforeEach(() => {
      dto = new StudentRegisterDto();
    });

    it('should be valid with all required fields', async () => {
      dto.name = 'John Doe';
      dto.studentNumber = '12345678';
      dto.major = 'Computer Science';
      dto.password = 'password123';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should be valid with optional image field', async () => {
      dto.name = 'John Doe';
      dto.studentNumber = '12345678';
      dto.major = 'Computer Science';
      dto.password = 'password123';
      dto.image = 'profile.jpg';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    describe('name validation', () => {
      beforeEach(() => {
        dto.studentNumber = '12345678';
        dto.major = 'Computer Science';
        dto.password = 'password123';
      });

      it('should fail when name is empty', async () => {
        dto.name = '';

        const errors = await validate(dto);
        const nameError = errors.find(error => error.property === 'name');
        
        expect(nameError).toBeDefined();
        expect(nameError?.constraints?.isNotEmpty).toBe('Nama mahasiswa harus diisi');
      });

      it('should fail when name is not provided', async () => {
        // Don't set name property

        const errors = await validate(dto);
        const nameError = errors.find(error => error.property === 'name');
        
        expect(nameError).toBeDefined();
      });

      it('should fail when name is not a string', async () => {
        (dto as any).name = 123;

        const errors = await validate(dto);
        const nameError = errors.find(error => error.property === 'name');
        
        expect(nameError).toBeDefined();
        expect(nameError?.constraints?.isString).toBeDefined();
      });
    });

    describe('studentNumber validation', () => {
      beforeEach(() => {
        dto.name = 'John Doe';
        dto.major = 'Computer Science';
        dto.password = 'password123';
      });

      it('should fail when studentNumber is empty', async () => {
        dto.studentNumber = '';

        const errors = await validate(dto);
        const studentNumberError = errors.find(error => error.property === 'studentNumber');
        
        expect(studentNumberError).toBeDefined();
        expect(studentNumberError?.constraints?.isNotEmpty).toBe('Nomor induk mahasiswa wajib diisi');
      });

      it('should fail when studentNumber is too short', async () => {
        dto.studentNumber = '123';

        const errors = await validate(dto);
        const studentNumberError = errors.find(error => error.property === 'studentNumber');
        
        expect(studentNumberError).toBeDefined();
        expect(studentNumberError?.constraints?.minLength).toBe('NIM minimal 5 karakter');
      });

      it('should pass when studentNumber has exactly 5 characters', async () => {
        dto.studentNumber = '12345';

        const errors = await validate(dto);
        const studentNumberError = errors.find(error => error.property === 'studentNumber');
        
        expect(studentNumberError).toBeUndefined();
      });
    });

    describe('major validation', () => {
      beforeEach(() => {
        dto.name = 'John Doe';
        dto.studentNumber = '12345678';
        dto.password = 'password123';
      });

      it('should fail when major is empty', async () => {
        dto.major = '';

        const errors = await validate(dto);
        const majorError = errors.find(error => error.property === 'major');
        
        expect(majorError).toBeDefined();
        expect(majorError?.constraints?.isNotEmpty).toBe('Jurusan wajib dipilih');
      });

      it('should fail when major is not a string', async () => {
        (dto as any).major = 123;

        const errors = await validate(dto);
        const majorError = errors.find(error => error.property === 'major');
        
        expect(majorError).toBeDefined();
        expect(majorError?.constraints?.isString).toBeDefined();
      });
    });

    describe('password validation', () => {
      beforeEach(() => {
        dto.name = 'John Doe';
        dto.studentNumber = '12345678';
        dto.major = 'Computer Science';
      });

      it('should fail when password is empty', async () => {
        dto.password = '';

        const errors = await validate(dto);
        const passwordError = errors.find(error => error.property === 'password');
        
        expect(passwordError).toBeDefined();
        expect(passwordError?.constraints?.isNotEmpty).toBe('Password wajib diisi');
      });

      it('should fail when password is too short', async () => {
        dto.password = '123';

        const errors = await validate(dto);
        const passwordError = errors.find(error => error.property === 'password');
        
        expect(passwordError).toBeDefined();
        expect(passwordError?.constraints?.minLength).toBe('Password minimal 6 karakter');
      });

      it('should pass when password has exactly 6 characters', async () => {
        dto.password = '123456';

        const errors = await validate(dto);
        const passwordError = errors.find(error => error.property === 'password');
        
        expect(passwordError).toBeUndefined();
      });
    });
  });

  describe('StudentLoginDto', () => {
    let dto: StudentLoginDto;

    beforeEach(() => {
      dto = new StudentLoginDto();
    });

    it('should be valid with all required fields', async () => {
      dto.studentNumber = '12345678';
      dto.password = 'password123';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    describe('studentNumber validation', () => {
      beforeEach(() => {
        dto.password = 'password123';
      });

      it('should fail when studentNumber is empty', async () => {
        dto.studentNumber = '';

        const errors = await validate(dto);
        const studentNumberError = errors.find(error => error.property === 'studentNumber');
        
        expect(studentNumberError).toBeDefined();
        expect(studentNumberError?.constraints?.isNotEmpty).toBe('Nomor induk mahasiswa wajib diisi');
      });

      it('should fail when studentNumber is not provided', async () => {
        // Don't set studentNumber property

        const errors = await validate(dto);
        const studentNumberError = errors.find(error => error.property === 'studentNumber');
        
        expect(studentNumberError).toBeDefined();
      });

      it('should fail when studentNumber is not a string', async () => {
        (dto as any).studentNumber = 123;

        const errors = await validate(dto);
        const studentNumberError = errors.find(error => error.property === 'studentNumber');
        
        expect(studentNumberError).toBeDefined();
        expect(studentNumberError?.constraints?.isString).toBeDefined();
      });
    });

    describe('password validation', () => {
      beforeEach(() => {
        dto.studentNumber = '12345678';
      });

      it('should fail when password is empty', async () => {
        dto.password = '';

        const errors = await validate(dto);
        const passwordError = errors.find(error => error.property === 'password');
        
        expect(passwordError).toBeDefined();
        expect(passwordError?.constraints?.isNotEmpty).toBe('Password wajib diisi');
      });

      it('should fail when password is not provided', async () => {
        // Don't set password property

        const errors = await validate(dto);
        const passwordError = errors.find(error => error.property === 'password');
        
        expect(passwordError).toBeDefined();
      });

      it('should fail when password is not a string', async () => {
        (dto as any).password = 123;

        const errors = await validate(dto);
        const passwordError = errors.find(error => error.property === 'password');
        
        expect(passwordError).toBeDefined();
        expect(passwordError?.constraints?.isString).toBeDefined();
      });
    });
  });
});