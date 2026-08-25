export interface IUser {
  employeeId: number
  employeeName: string
  contactNo: string
  emailId: string
  deptId: number
  password: string
  gender: string
  role: string
  createdDate: string
}

export interface IApiResponseModel {
  result: boolean;
  message: string;
  data: any;
}

export interface IParentDepartment {
  departmentId: number;
  departmentName: string;
  departmentLogo: string;
}

export interface IChildDepartment {
  childDeptId: number;
  departmentName: string;
  parentDeptId: string;
}

export interface IProject {
  projectId: number
  projectName: string
  clientName: string
  startDate: string
  leadByEmpId: number
  contactPerson: string
  contactNo: string
  emailId: string
  employeeName: string
}

export interface NewProjectModel extends IProject {
} 