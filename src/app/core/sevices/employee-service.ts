import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { EmployeeModel } from '../model/classes/Employee.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { GlobalConstants } from '../constants/global.constant';

@Service()
export class EmployeeService {
    http: any = inject(HttpClient);

    constructor() {
    }

    getAllEmployee(): Observable<EmployeeModel[]> {
        return this.http.get(environment.API_URL + GlobalConstants.API_METHOD.GET_ALL_EMPLOYEES);
    }

    onCreateEmployee(employeeObj: EmployeeModel): Observable<EmployeeModel> {
        return this.http.post(environment.API_URL + GlobalConstants.API_METHOD.CREATE_EMPLOYEE, employeeObj);
    }

    getEmployeeById(employeeId: string): Observable<EmployeeModel> {
        return this.http.get(environment.API_URL + GlobalConstants.API_METHOD.GET_EMPLOYEES + '/' + employeeId);
    }
}
