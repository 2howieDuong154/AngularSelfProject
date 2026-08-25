import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { IApiResponseModel } from '../model/Interfaces/User.Model';
import { GlobalConstants } from '../constants/global.constant';

@Service()
export class MasterService {
    http: any = inject(HttpClient);
    constructor() { }
    getAllParentDept(): Observable<IApiResponseModel> {
        return this.http.get(environment.COMPLAINT_API_URL
             + GlobalConstants.API_METHOD.GET_ALL_PARENT_DEPT);
    }
    getAllChildDeptByParentId(parentId: number): Observable<IApiResponseModel> {
        return this.http.get(environment.API_URL + GlobalConstants.API_METHOD.GET_ALL_CHILD_DEPT_BY_PARENT_ID + `?deptId=${parentId}`);
    }
}
