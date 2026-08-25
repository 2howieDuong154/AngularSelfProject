import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmployeeModel } from '../../core/model/classes/Employee.model';
import { EmployeeService } from '../../core/sevices/employee-service';
import { MasterService } from '../../core/sevices/master-service';
import { IApiResponseModel, IChildDepartment, IParentDepartment } from '../../core/model/Interfaces/User.Model';
import { ActivatedRoute } from '@angular/router';

@Component({
  imports: [FormsModule],
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
        this.employeeObj = employee;
        console.log('Employee fetched successfully:', employee);
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
      },
      error: (error) => {
        console.error('Error fetching parent departments:', error);
        }
      });
  }

  onSaveEmployee() {
    this.employeeService.onCreateEmployee(this.employeeObj).subscribe({
      next: (response: EmployeeModel) => {
        alert('Employee created successfully!');
        console.log('Employee created successfully:', response);
      },
      error: (error) => {
        console.error('Error creating employee:', error);
      }
    })
  }

  onChangeParentDept(event: any) {
    const selectedParentDeptId = event.target.value;
    console.log('Selected Parent Department ID:', selectedParentDeptId);
    this.masterService.getAllChildDeptByParentId(selectedParentDeptId).subscribe({
      next: (response: IApiResponseModel) => {
        console.log('Child departments fetched successfully:', response.data);
        this.childDeptList.set(response.data);
        // Handle the child departments data as needed
      },
      error: (error) => {
        console.error('Error fetching child departments:', error);
      }
    });
  }
}
