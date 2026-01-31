import { AbilityBuilder, Ability, ExtractSubjectType, InferSubjects } from '@casl/ability';
import { Injectable, Logger } from '@nestjs/common';
import { Role } from '../enums/role.enum';
import { Student } from '../../students/entities/student.entity';
import { Lecturer } from '../../lecturers/entities/lecturer.entity';
import { Enrollment } from '../../enrollments/entities/enrollment.entity';
import { GuidanceAgenda } from '../../guidance-agendas/entities/guidance-agenda.entity';
import { Submission } from '../../submissions/entities/submission.entity';
import { Feedback } from '../../submissions/entities/feedback.entity';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
  Approve = 'approve',
  Review = 'review',
  Submit = 'submit',
}

type Subjects = InferSubjects<typeof Student | typeof Lecturer | typeof Enrollment | typeof GuidanceAgenda | typeof Submission | typeof Feedback> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
  private readonly logger = new Logger(AbilityFactory.name);

  defineAbility(user: any): AppAbility {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(Ability);

    this.logger.log(`Defining abilities for user ${user.id} with role ${user.role}`);

    // Define abilities based on role
    switch (user.role) {
      case Role.STUDENT:
        this.defineStudentAbilities(can, cannot, user);
        break;
      case Role.LECTURER:
        this.defineLecturerAbilities(can, cannot, user);
        break;
      default:
        this.logger.warn(`Unknown role: ${user.role} for user ${user.id}`);
    }

    return build({
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
    });
  }

  private defineStudentAbilities(can: any, cannot: any, user: any) {
    // Student management - students can read their own data
    can(Action.Read, Student, { id: user.id });

    // Lecturer management - students can read lecturer data
    can(Action.Read, Lecturer);

    // Enrollment management - students can manage their own enrollments
    can(Action.Create, Enrollment);
    can(Action.Read, Enrollment, { studentId: user.id });
    can(Action.Delete, Enrollment, { studentId: user.id });

    // Guidance agenda - students can read their agendas
    can(Action.Read, GuidanceAgenda, { studentId: user.id });

    // Submissions - students can manage their own submissions
    can(Action.Create, Submission);
    can(Action.Read, Submission, { studentId: user.id });
    can(Action.Update, Submission, { studentId: user.id, status: 'draft' });
    can(Action.Submit, Submission, { studentId: user.id, status: 'draft' });

    // Feedback - students can only read feedback on their submissions
    can(Action.Read, Feedback, { 'submission.studentId': user.id });

    // Students cannot access other students' data (already handled by condition above)
  }

  private defineLecturerAbilities(can: any, cannot: any, user: any) {
    // Lecturer management - lecturers can read all lecturers, update their own profile
    can(Action.Read, Lecturer);
    can(Action.Update, Lecturer, { id: user.id });

    // Student management - lecturers can read student data
    can(Action.Read, Student);

    // Enrollment management - lecturers can read and delete enrollments
    can(Action.Read, Enrollment);
    can(Action.Delete, Enrollment, { lecturerId: user.id });
    can(Action.Approve, Enrollment, { lecturerId: user.id });

    // Guidance agenda - lecturers can manage their own agendas
    can(Action.Create, GuidanceAgenda);
    can(Action.Read, GuidanceAgenda, { lecturerId: user.id });
    can(Action.Update, GuidanceAgenda, { lecturerId: user.id });
    can(Action.Delete, GuidanceAgenda, { lecturerId: user.id });

    // Submissions - lecturers can read and review student submissions
    can(Action.Read, Submission);
    can(Action.Review, Submission, { lecturerId: user.id });
    can(Action.Approve, Submission, { lecturerId: user.id });

    // Feedback - lecturers can create and manage feedback
    can(Action.Create, Feedback);
    can(Action.Read, Feedback, { lecturerId: user.id });
    can(Action.Update, Feedback, { lecturerId: user.id });
    can(Action.Delete, Feedback, { lecturerId: user.id });

    // Lecturers cannot modify student profiles or create enrollments for students
    cannot(Action.Update, Student).because('Lecturers cannot modify student profiles');
    cannot(Action.Create, Enrollment).because('Only students can create enrollments');
  }
}