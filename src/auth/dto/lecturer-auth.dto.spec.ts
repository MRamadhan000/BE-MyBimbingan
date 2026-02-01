import { validate } from 'class-validator';
import { LecturerRegisterDto, LecturerLoginDto } from './lecturer-auth.dto';

describe('LecturerAuthDto', () => {
  describe('LecturerRegisterDto', () => {
    let dto: LecturerRegisterDto;

    beforeEach(() => {
      dto = new LecturerRegisterDto();
    });

    it('should be valid with all required fields', async () => {
      dto.name = 'Jane Smith';
      dto.nuptk = '1234567890';
      dto.interests = ['AI', 'Machine Learning'];
      dto.password = 'password123';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should be valid with optional image field', async () => {
      dto.name = 'Jane Smith';
      dto.nuptk = '1234567890';
      dto.interests = ['AI', 'Machine Learning'];
      dto.password = 'password123';
      dto.image = 'profile.jpg';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    describe('name validation', () => {
      beforeEach(() => {
        dto.nuptk = '1234567890';
        dto.interests = ['AI', 'Machine Learning'];
        dto.password = 'password123';
      });

      it('should fail when name is empty', async () => {
        dto.name = '';

        const errors = await validate(dto);
        const nameError = errors.find(error => error.property === 'name');
        
        expect(nameError).toBeDefined();
        expect(nameError?.constraints?.isNotEmpty).toBe('Nama dosen tidak boleh kosong');
      });

      it('should fail when name is too long', async () => {
        dto.name = 'a'.repeat(101);

        const errors = await validate(dto);
        const nameError = errors.find(error => error.property === 'name');
        
        expect(nameError).toBeDefined();
        expect(nameError?.constraints?.maxLength).toBe('Nama terlalu panjang, maksimal 100 karakter');
      });

      it('should pass when name has exactly 100 characters', async () => {
        dto.name = 'a'.repeat(100);

        const errors = await validate(dto);
        const nameError = errors.find(error => error.property === 'name');
        
        expect(nameError).toBeUndefined();
      });

      it('should fail when name is not a string', async () => {
        (dto as any).name = 123;

        const errors = await validate(dto);
        const nameError = errors.find(error => error.property === 'name');
        
        expect(nameError).toBeDefined();
        expect(nameError?.constraints?.isString).toBeDefined();
      });
    });

    describe('nuptk validation', () => {
      beforeEach(() => {
        dto.name = 'Jane Smith';
        dto.interests = ['AI', 'Machine Learning'];
        dto.password = 'password123';
      });

      it('should fail when nuptk is empty', async () => {
        dto.nuptk = '';

        const errors = await validate(dto);
        const nuptkError = errors.find(error => error.property === 'nuptk');
        
        expect(nuptkError).toBeDefined();
        expect(nuptkError?.constraints?.isNotEmpty).toBe('NUPTK wajib diisi');
      });

      it('should fail when nuptk is too long', async () => {
        dto.nuptk = 'a'.repeat(21);

        const errors = await validate(dto);
        const nuptkError = errors.find(error => error.property === 'nuptk');
        
        expect(nuptkError).toBeDefined();
        expect(nuptkError?.constraints?.maxLength).toBe('NUPTK maksimal 20 karakter');
      });

      it('should pass when nuptk has exactly 20 characters', async () => {
        dto.nuptk = 'a'.repeat(20);

        const errors = await validate(dto);
        const nuptkError = errors.find(error => error.property === 'nuptk');
        
        expect(nuptkError).toBeUndefined();
      });

      it('should fail when nuptk is not a string', async () => {
        (dto as any).nuptk = 123;

        const errors = await validate(dto);
        const nuptkError = errors.find(error => error.property === 'nuptk');
        
        expect(nuptkError).toBeDefined();
        expect(nuptkError?.constraints?.isString).toBeDefined();
      });
    });

    describe('interests validation', () => {
      beforeEach(() => {
        dto.name = 'Jane Smith';
        dto.nuptk = '1234567890';
        dto.password = 'password123';
      });

      it('should fail when interests is empty array', async () => {
        dto.interests = [];

        const errors = await validate(dto);
        const interestsError = errors.find(error => error.property === 'interests');
        
        expect(interestsError).toBeDefined();
        expect(interestsError?.constraints?.arrayMinSize).toBe('Minimal masukkan satu bidang minat');
      });

      it('should fail when interests is not an array', async () => {
        (dto as any).interests = 'AI';

        const errors = await validate(dto);
        const interestsError = errors.find(error => error.property === 'interests');
        
        expect(interestsError).toBeDefined();
        expect(interestsError?.constraints?.isArray).toBe('Bidang minat harus berupa array');
      });

      it('should fail when interests contains non-string values', async () => {
        dto.interests = ['AI', 123 as any, 'ML'];

        const errors = await validate(dto);
        const interestsError = errors.find(error => error.property === 'interests');
        
        expect(interestsError).toBeDefined();
        expect(interestsError?.constraints?.isString).toBe('Setiap bidang minat harus berupa teks');
      });

      it('should pass with single interest', async () => {
        dto.interests = ['AI'];

        const errors = await validate(dto);
        const interestsError = errors.find(error => error.property === 'interests');
        
        expect(interestsError).toBeUndefined();
      });

      it('should pass with multiple interests', async () => {
        dto.interests = ['AI', 'Machine Learning', 'Data Science', 'Computer Vision'];

        const errors = await validate(dto);
        const interestsError = errors.find(error => error.property === 'interests');
        
        expect(interestsError).toBeUndefined();
      });
    });

    describe('password validation', () => {
      beforeEach(() => {
        dto.name = 'Jane Smith';
        dto.nuptk = '1234567890';
        dto.interests = ['AI', 'Machine Learning'];
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

      it('should fail when password is not a string', async () => {
        (dto as any).password = 123;

        const errors = await validate(dto);
        const passwordError = errors.find(error => error.property === 'password');
        
        expect(passwordError).toBeDefined();
        expect(passwordError?.constraints?.isString).toBeDefined();
      });
    });
  });

  describe('LecturerLoginDto', () => {
    let dto: LecturerLoginDto;

    beforeEach(() => {
      dto = new LecturerLoginDto();
    });

    it('should be valid with all required fields', async () => {
      dto.nuptk = '1234567890';
      dto.password = 'password123';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    describe('nuptk validation', () => {
      beforeEach(() => {
        dto.password = 'password123';
      });

      it('should fail when nuptk is empty', async () => {
        dto.nuptk = '';

        const errors = await validate(dto);
        const nuptkError = errors.find(error => error.property === 'nuptk');
        
        expect(nuptkError).toBeDefined();
        expect(nuptkError?.constraints?.isNotEmpty).toBe('NUPTK wajib diisi');
      });

      it('should fail when nuptk is not provided', async () => {
        // Don't set nuptk property

        const errors = await validate(dto);
        const nuptkError = errors.find(error => error.property === 'nuptk');
        
        expect(nuptkError).toBeDefined();
      });

      it('should fail when nuptk is not a string', async () => {
        (dto as any).nuptk = 123;

        const errors = await validate(dto);
        const nuptkError = errors.find(error => error.property === 'nuptk');
        
        expect(nuptkError).toBeDefined();
        expect(nuptkError?.constraints?.isString).toBeDefined();
      });
    });

    describe('password validation', () => {
      beforeEach(() => {
        dto.nuptk = '1234567890';
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