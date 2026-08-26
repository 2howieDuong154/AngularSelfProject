import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { GlobalConstants } from '../constants/global.constant';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProject, IProjectEmployee, NewProjectModel } from '../model/Interfaces/User.Model';

@Service()
export class ProjectService {
    http = inject(HttpClient);

    getAllProjects(): Observable<IProject[]> {
        return this.http.get<IProject[]>(
            environment.API_URL + GlobalConstants.API_PROJECT_METHOD.GET_ALL_PROJECTS
        )
    }
    createProject(projectObj: NewProjectModel): Observable<NewProjectModel> {
        return this.http.post<NewProjectModel>(environment.API_URL + GlobalConstants.API_PROJECT_METHOD.CREATE_PROJECT, projectObj);
    }

    getAllProjectEmployees(): Observable<IProjectEmployee[]> {
        return this.http.get<IProjectEmployee[]>(environment.API_URL + GlobalConstants.API_PROJECT_METHOD.GET_ALL_PROJECT_EMPLOYEES);
    }

    addEmployeeToProject(projectObj: IProjectEmployee): Observable<IProjectEmployee> {
        return this.http.post<IProjectEmployee>(environment.API_URL + GlobalConstants.API_PROJECT_METHOD.ADD_EMPLOYEE_TO_PROJECT, projectObj);
    }
}
