export const ClassScheduleData = [
    {
        id: 1,
        start_time: "08:00", // 24-hour format
        end_time: "09:30",
        day_of_week: "M", // Monday
        classifiedsection_id: 101,
        academicprogram_id: 201,
        classroomscheduling_id: 301,
        profile_id: null, // Optional, set to null if not assigned
        semacyear_id: null, // Optional, set to null if not assigned
        created_at: "2024-01-01T08:00:00Z",
        updated_at: "2024-12-01T10:00:00Z",
        deleted_at: null, // No deletion yet
    },
    {
        id: 2,
        start_time: "10:00",
        end_time: "11:30",
        day_of_week: "T", // Tuesday
        classifiedsection_id: 102,
        academicprogram_id: 202,
        classroomscheduling_id: 302,
        profile_id: null,
        semacyear_id: null,
        created_at: "2024-01-02T09:00:00Z",
        updated_at: "2024-12-02T11:00:00Z",
        deleted_at: null,
    },
    {
        id: 3,
        start_time: "13:00",
        end_time: "14:30",
        day_of_week: "W", // Wednesday
        classifiedsection_id: 103,
        academicprogram_id: 203,
        classroomscheduling_id: 303,
        profile_id: 501, // Optional, assigned a profile
        semacyear_id: 601, // Optional, assigned a semester academic year
        created_at: "2024-01-03T13:00:00Z",
        updated_at: "2024-12-03T14:30:00Z",
        deleted_at: null,
    },
    {
        id: 4,
        start_time: "15:00",
        end_time: "16:30",
        day_of_week: "TH", // Thursday
        classifiedsection_id: 104,
        academicprogram_id: 204,
        classroomscheduling_id: 304,
        profile_id: null,
        semacyear_id: null,
        created_at: "2024-01-04T15:00:00Z",
        updated_at: "2024-12-04T16:30:00Z",
        deleted_at: null,
    },
    // Add more class schedules as needed
];
