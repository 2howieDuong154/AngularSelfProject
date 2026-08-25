import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmployeeModel } from '../../core/model/classes/Employee.model';
import { EmployeeService } from '../../core/sevices/employee-service';
import { MasterService } from '../../core/sevices/master-service';
import { IApiResponseModel, IChildDepartment, IParentDepartment } from '../../core/model/Interfaces/User.Model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-employee-form',
  styleUrl: './employee-form.css',
  templateUrl: './employee-form.html',
})
export class EmployeeForm {
  employeeObj: EmployeeModel = new EmployeeModel();
  employeeService = inject(EmployeeService);
  masterService = inject(MasterService);

   parentDeptList: WritableSignal<IParentDepartment[]> = signal([]);
   childDeptList: WritableSignal<IChildDepartment[]> = signal([]);
   activateRoute = inject(ActivatedRoute);

   currentEmployeeId: string = '';
  selectedParentDeptId: number | null = null;
  readonly genderOptions = ['Male', 'Female', 'Other'];
  readonly roleOptions = ['Employee', 'Manager', 'Administrator'];
  
  ngOnInit() {
    this.getAllParentDept();
    this.activateRoute.params.subscribe((params) => {
      const employeeId = params['id'];
      console.log('Employee ID from route:', employeeId);
      if (employeeId && employeeId !== '0') {
        this.currentEmployeeId = employeeId;
        this.getEmployeeDetails(employeeId);
      }
    });
  }
  getEmployeeDetails(employeeId: string) {
    this.employeeService.getEmployeeById(employeeId).subscribe({
      next: (employee: EmployeeModel) => {
        this.employeeObj = {
          ...employee,
          employeeId: Number(employee.employeeId),
          deptId: Number(employee.deptId),
          gender: this.matchOption(employee.gender, this.genderOptions),
          role: this.matchOption(employee.role, this.roleOptions)
        };
        this.loadEmployeeDepartments();
        console.log('Employee fetched successfully:', this.employeeObj);
      },
      error: (error: any) => {
        console.error('Error fetching employee:', error);
      }
    });
  }

  getAllParentDept() {
    this.masterService.getAllParentDept().subscribe({
      next: (response: IApiResponseModel) => {
        this.parentDeptList.set(response.data);
        this.loadEmployeeDepartments();
      },
      error: (error) => {
        console.error('Error fetching parent departments:', error);
        }
      });
  }

  private loadEmployeeDepartments() {
    if (!this.currentEmployeeId || !this.employeeObj.deptId || !this.parentDeptList().length) {
      return;
    }

    const requests = this.parentDeptList().map((parentDepartment) =>
      this.masterService.getAllChildDeptByParentId(parentDepartment.departmentId)
    );

    forkJoin(requests).subscribe({
      next: (responses) => {
        const parentIndex = responses.findIndex((response) =>
          (Array.isArray(response.data) ? response.data : []).some((childDepartment: IChildDepartment) =>
            Number(childDepartment.childDeptId) === Number(this.employeeObj.deptId)
          )
        );

        if (parentIndex === -1) {
          return;
        }

        this.selectedParentDeptId = this.parentDeptList()[parentIndex].departmentId;
        this.childDeptList.set(responses[parentIndex].data ?? []);
      },
      error: (error) => {
        console.error('Error fetching employee departments:', error);
      }
    });
  }

  private matchOption(value: string, options: string[]) {
    const normalizedValue = value?.trim().toLowerCase();
    return options.find((option) => option.toLowerCase() === normalizedValue) ?? '';
  }

  onSaveEmployee() {
    const saveRequest = this.currentEmployeeId
      ? this.employeeService.onUpdateEmployee(this.employeeObj)
      : this.employeeService.onCreateEmployee(this.employeeObj);

    saveRequest.subscribe({
      next: (response: EmployeeModel) => {
        alert(this.currentEmployeeId ? 'Employee updated successfully!' : 'Employee created successfully!');
        console.log('Employee saved successfully:', response);
      },
      error: (error) => {
        console.error('Error creating employee:', error);
      }
    })
  }

  onChangeParentDept(selectedParentDeptId: number | null) {
    console.log('Selected Parent Department ID:', selectedParentDeptId);
    if (selectedParentDeptId === null) {
      this.childDeptList.set([]);
      return;
    }
    this.masterService.getAllChildDeptByParentId(selectedParentDeptId).subscribe({
      next: (response: IApiResponseModel) => {
        console.log('Child departments fetched successfully:', response.data);
        this.childDeptList.set(response.data ?? []);
        // Handle the child departments data as needed
      },
      error: (error) => {
        console.error('Error fetching child departments:', error);
      }
    });
  }
}
