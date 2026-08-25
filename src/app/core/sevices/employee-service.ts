import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { EmployeeModel } from '../model/classes/Employee.model';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { GlobalConstants } from '../constants/global.constant';
import { IApiResponseModel } from '../model/Interfaces/User.Model';

@Service()
export class EmployeeService {
    http: any = inject(HttpClient);

    constructor() {
    }

    getAllEmployee(): Observable<EmployeeModel[]> {
        return this.http.get(
            environment.API_URL + GlobalConstants.API_METHOD.GET_ALL_EMPLOYEES
        ).pipe(
            map((response: EmployeeModel[] | IApiResponseModel) =>
                Array.isArray(response) ? response : response.data ?? []
            )
        );
    }

    onCreateEmployee(employeeObj: EmployeeModel): Observable<EmployeeModel> {
        return this.http.post(environment.API_URL + GlobalConstants.API_METHOD.CREATE_EMPLOYEE, employeeObj);
    }

    getEmployeeById(employeeId: string): Observable<EmployeeModel> {
        return this.getAllEmployee().pipe(
            map((employees) => {
                const employee = employees.find((item) =>
                    Number(item.employeeId) === Number(employeeId)
                );

                if (!employee) {
                    throw new Error(`Employee ${employeeId} was not found`);
                }

                return employee;
            })
        );
    }

    onUpdateEmployee(employeeObj: EmployeeModel): Observable<EmployeeModel> {
        return this.http.put(environment.API_URL + GlobalConstants.API_METHOD.UPDATE_EMPLOYEE + '/' + employeeObj.employeeId, employeeObj);
    }
}
