<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ProfileController; 
use App\Http\Controllers\ParentInfoController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\YearLevelController;
use App\Http\Controllers\SubjectCategoryController;
use App\Http\Controllers\CurriculumController;
use App\Http\Controllers\SubjectCurriculumController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\CollegeProgramController;
use App\Http\Controllers\CollegeProgramDepartmentController;
use App\Http\Controllers\AcademicProgramController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\RoomTagController;
use App\Http\Controllers\FloorController;
use App\Http\Controllers\ClassifiedSectionController;
use App\Http\Controllers\BuildingController;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\ClassroomSchedulingController;
use App\Http\Controllers\SemesterController;
use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\SemesterAcademicYearController;
use App\Http\Controllers\ClassScheduleController;
use App\Http\Controllers\EnlistmentController;
use App\Http\Controllers\EnrollmentTrackingController;
use App\Http\Controllers\AssignmentTrackingController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SubjectController;




//retrieval of soft deleted data
Route::get('roles/deleted-list', [RoleController::class, 'getDeletedRoles']);
Route::get('profiles/deleted-list', [ProfileController::class, 'getDeletedProfiles']);
Route::get('parentinfo/deleted-list', [ParentInfoController::class, 'getDeletedParentInfos']);
Route::get('yearlevel/deleted-list', [YearLevelController::class, 'getDeletedYearLevels']);
Route::get('subjectcategory/deleted-list', [SubjectCategoryController::class, 'getDeletedSubjectCategories']);
Route::get('curriculum/deleted-list', [CurriculumController::class, 'getDeletedCurriculums']);
Route::get('subjectcurriculum/deleted-list', [SubjectCurriculumController::class, 'getDeletedSubjectCurriculums']);
Route::get('department/deleted-list', [DepartmentController::class, 'getDeletedDepartments']);
Route::get('collegeprogram/deleted-list', [CollegeProgramController::class, 'getDeletedCollegePrograms']);
Route::get('collegeprogramdepartment/deleted-list', [CollegeProgramDepartmentController::class, 'getDeletedCollegeProgramDepartments']);
Route::get('academicprogram/deleted-list', [AcademicProgramController::class, 'getDeletedAcademicPrograms']);
Route::get('sections/deleted-list', [SectionController::class, 'getDeletedSections']);
Route::get('roomtag/deleted-list', [RoomTagController::class, 'getDeletedRoomTags']);
Route::get('users/deleted-list', [UserController::class, 'getDeletedUsers']);
Route::get('floor/deleted-list', [FloorController::class, 'getDeletedFloors']);
Route::get('classifiedsection/deleted-list', [ClassifiedSectionController::class, 'getDeletedClassifiedSections']);
Route::get('building/deleted-list', [BuildingController::class, 'getDeletedBuildings']);
Route::get('classroom/deleted-list', [ClassroomController::class, 'getDeletedClassrooms']);
Route::get('classroomscheduling/deleted-list', [ClassroomSchedulingController::class, 'getDeletedClassroomSchedules']);
Route::get('semester/deleted-list', [SemesterController::class, 'getDeletedSemesters']);
Route::get('academicyear/deleted-list', [AcademicYearController::class, 'getDeletedAcademicYears']);
Route::get('semesteracademicyear/deleted-list', [SemesterAcademicYearController::class, 'getDeletedSemesterAcademicYears']);
Route::get('classschedule/deleted-list', [ClassScheduleController::class, 'getDeletedClassSchedules']);
Route::get('enlistment/deleted-list', [EnlistmentController::class, 'getDeletedEnlistments']);
Route::get('enrollmenttracking/deleted-list', [EnrollmentTrackingController::class, 'getDeletedEnrollmentTrackings']);
Route::get('assignmenttracking/deleted-list', [AssignmentTrackingController::class, 'getDeletedAssignmentTrackings']);
Route::get('event/deleted-list', [EventController::class, 'getDeletedEvents']);
Route::get('announcement/deleted-list', [AnnouncementController::class, 'getDeletedAnnouncements']);
Route::get('notification/deleted-list', [NotificationController::class, 'getDeletedNotifications']);
Route::get('subject/deleted-list', [SubjectController::class, 'getDeletedSubjects']);




//GET, POST, PUT, DELETE
Route::apiResource('roles', RoleController::class);
Route::apiResource('profiles', ProfileController::class);
Route::apiResource('parentinfo', ParentInfoController::class);
Route::apiResource('yearlevel', YearLevelController::class);
Route::apiResource('subjectcategory', SubjectCategoryController::class);
Route::apiResource('curriculum', CurriculumController::class);
Route::apiResource('subjectcurriculum', SubjectCurriculumController::class);
Route::apiResource('department', DepartmentController::class);
Route::apiResource('collegeprogram', CollegeProgramController::class);
Route::apiResource('collegeprogramdepartment', CollegeProgramDepartmentController::class);
Route::apiResource('academicprogram', AcademicProgramController::class);
Route::apiResource('users', UserController::class);
Route::apiResource('sections', SectionController::class);
Route::apiResource('roomtag', RoomTagController::class);
Route::apiResource('floor', FloorController::class);
Route::apiResource('classifiedsection', ClassifiedSectionController::class);
Route::apiResource('building', BuildingController::class);
Route::apiResource('classroom', ClassroomController::class);
Route::apiResource('classroomscheduling', ClassroomSchedulingController::class);
Route::apiResource('semester', SemesterController::class);
Route::apiResource('academicyear', AcademicYearController::class);
Route::apiResource('semesteracademicyear', SemesterAcademicYearController::class);
Route::apiResource('classschedule', ClassScheduleController::class);
Route::apiResource('enlistment', EnlistmentController::class);
Route::apiResource('enrollmenttracking', EnrollmentTrackingController::class);
Route::apiResource('assignmenttracking', AssignmentTrackingController::class);
Route::apiResource('event', EventController::class);
Route::apiResource('announcement', AnnouncementController::class);
Route::apiResource('notification', NotificationController::class);
Route::apiResource('subject', SubjectController::class);




//RESTORE SOFT DELETED DATA
Route::post('roles/{id}/restore', [RoleController::class, 'restore']);
Route::post('profiles/{id}/restore', [ProfileController::class, 'restore']);
Route::post('parentinfo/{id}/restore', [ParentInfoController::class, 'restore']);
Route::post('yearlevel/{id}/restore', [YearLevelController::class, 'restore']);
Route::post('subjectcategory/{id}/restore', [SubjectCategoryController::class, 'restore']);
Route::post('curriculum/{id}/restore', [CurriculumController::class, 'restore']);
Route::post('subjectcurriculum/{id}/restore', [SubjectCurriculumController::class, 'restore']);
Route::post('department/{id}/restore', [DepartmentController::class, 'restore']);
Route::post('collegeprogram/{id}/restore', [CollegeProgramController::class, 'restore']);
Route::post('collegeprogramdepartment/{id}/restore', [CollegeProgramDepartmentController::class, 'restore']);
Route::post('academicprogram/{id}/restore', [AcademicProgramController::class, 'restore']);
Route::post('sections/{id}/restore', [SectionController::class, 'restore']);
Route::post('roomtag/{id}/restore', [RoomTagController::class, 'restore']);
Route::post('users/{id}/restore', [UserController::class, 'restore']);
Route::post('floor/{id}/restore', [FloorController::class, 'restore']);
Route::post('classifiedsection/{id}/restore', [ClassifiedSectionController::class, 'restore']);
Route::post('building/{id}/restore', [BuildingController::class, 'restore']);
Route::post('classroom/{id}/restore', [ClassroomController::class, 'restore']);
Route::post('classroomscheduling/{id}/restore', [ClassroomSchedulingController::class, 'restore']);
Route::post('semester/{id}/restore', [SemesterController::class, 'restore']);
Route::post('academicyear/{id}/restore', [AcademicYearController::class, 'restore']);
Route::post('semesteracademicyear/{id}/restore', [SemesterAcademicYearController::class, 'restore']);
Route::post('classschedule/{id}/restore', [ClassScheduleController::class, 'restore']);
Route::post('enlistment/{id}/restore', [EnlistmentController::class, 'restore']);
Route::post('enrollmenttracking/{id}/restore', [EnrollmentTrackingController::class, 'restore']);
Route::post('assignmenttracking/{id}/restore', [AssignmentTrackingController::class, 'restore']);
Route::post('event/{id}/restore', [EventController::class, 'restore']);
Route::post('announcement/{id}/restore', [AnnouncementController::class, 'restore']);
Route::post('notification/{id}/restore', [NotificationController::class, 'restore']);
Route::post('subject/{id}/restore', [SubjectController::class, 'restore']);


//PERMANENTLY DELETE DATA
Route::delete('roles/{id}/force', [RoleController::class, 'forceDelete']);
Route::delete('profiles/{id}/force', [ProfileController::class, 'forceDelete']);
Route::delete('parentinfo/{id}/force', [ParentInfoController::class, 'forceDelete']);
Route::delete('yearlevel/{id}/force', [YearLevelController::class, 'forceDelete']);
Route::delete('subjectcategory/{id}/force', [SubjectCategoryController::class, 'forceDelete']);
Route::delete('curriculum/{id}/force', [CurriculumController::class, 'forceDelete']);
Route::delete('subjectcurriculum/{id}/force', [SubjectCurriculumController::class, 'forceDelete']);
Route::delete('department/{id}/force', [DepartmentController::class, 'forceDelete']);
Route::delete('collegeprogram/{id}/force', [CollegeProgramController::class, 'forceDelete']);
Route::delete('collegeprogramdepartment/{id}/force', [CollegeProgramDepartmentController::class, 'forceDelete']);
Route::delete('academicprogram/{id}/force', [AcademicProgramController::class, 'forceDelete']);
Route::delete('sections/{id}/force', [SectionController::class, 'forceDelete']);
Route::delete('roomtag/{id}/force', [RoomTagController::class, 'forceDelete']);
Route::delete('users/{id}/force', [UserController::class, 'forceDelete']);
Route::delete('floor/{id}/force', [FloorController::class, 'forceDelete']);
Route::delete('classifiedsection/{id}/force', [ClassifiedSectionController::class, 'forceDelete']);
Route::delete('building/{id}/force', [BuildingController::class, 'forceDelete']);
Route::delete('classroom/{id}/force', [ClassroomController::class, 'forceDelete']);
Route::delete('classroomscheduling/{id}/force', [ClassroomSchedulingController::class, 'forceDelete']);
Route::delete('semester/{id}/force', [SemesterController::class, 'forceDelete']);
Route::delete('academicyear/{id}/force', [AcademicYearController::class, 'forceDelete']);
Route::delete('semesteracademicyear/{id}/force', [SemesterAcademicYearController::class, 'forceDelete']);
Route::delete('classschedule/{id}/force', [ClassScheduleController::class, 'forceDelete']);
Route::delete('enlistment/{id}/force', [EnlistmentController::class, 'forceDelete']);
Route::delete('enrollmenttracking/{id}/force', [EnrollmentTrackingController::class, 'forceDelete']);
Route::delete('assignmenttracking/{id}/force', [AssignmentTrackingController::class, 'forceDelete']);
Route::delete('event/{id}/force', [EventController::class, 'forceDelete']);
Route::delete('announcement/{id}/force', [AnnouncementController::class, 'forceDelete']);
Route::delete('notification/{id}/force', [NotificationController::class, 'forceDelete']);
Route::delete('subject/{id}/force', [SubjectController::class, 'forceDelete']);



//------------------------------------------------------------------------------------>>>>>>






/* User Role Controller */
// Route::apiResource("", App\Http\Controllers\Controller::class);
// Route::post("", App\Http\Controllers\::class);
// Route::get("", App\Http\Controllers\::class);




//Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//    return $request->user();
//});
