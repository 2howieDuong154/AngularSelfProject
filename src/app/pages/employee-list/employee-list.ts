import { AsyncPipe, SlicePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { EmployeeModel } from '../../core/model/classes/Employee.model';
import { EmployeeService } from '../../core/sevices/employee-service';

@Component({
  imports: [RouterLink, AsyncPipe, SlicePipe],
  selector: 'app-employee-list',
  styleUrl: './employee-list.css',
  templateUrl: './employee-list.html',
})
export class EmployeeList {
  router: any = inject(Router);
  employeeList$: Observable<EmployeeModel[]> = new Observable<EmployeeModel[]>();
  
  employeeService = inject(EmployeeService);

  constructor() {
    this.employeeList$ = this.employeeService.getAllEmployee();
  }
}
