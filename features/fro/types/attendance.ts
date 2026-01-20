export interface AttendanceRecord {
  id: string;
  userId: string;
  punchInTime: string | null;
  punchOutTime: string | null;
  punchInLatitude: number | null;
  punchInLongitude: number | null;
  punchOutLatitude: number | null;
  punchOutLongitude: number | null;
  punchInAddress: string | null;
  punchOutAddress: string | null;
  attendanceStatus: string;
  createdOn: string;
}

export interface AttendanceListResponse {
  success: boolean;
  message?: string;
  data: {
    items: AttendanceRecord[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
  };
}
