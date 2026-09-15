export const UserType = {
    Tourist: "TOURIST",
    TourGuide: "TOURGUIDE",
    AgencyStaff: "AGENCYSTAFF",
    TourManager: "TOURMANAGER",
} as const;

export const ValidUserTypes = {
    Tourist: "TOURIST",
    TourGuide: "TOURGUIDE",
    AgencyStaff: "AGENCYSTAFF",
    TourManager: "TOURMANAGER",
} as const;

export type UserType = (typeof UserType)[keyof typeof UserType];
export type ValidUserTypes = (typeof ValidUserTypes)[keyof typeof ValidUserTypes];