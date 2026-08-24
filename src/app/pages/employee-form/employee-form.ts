import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmployeeModel } from '../../core/model/classes/Employee.model';

@Component({
  imports: [FormsModule],
  selector: 'app-employee-form',
  styleUrl: './employee-form.css',
  templateUrl: './employee-form.html',
})
export class EmployeeForm {
  employeeObj: EmployeeModel = new EmployeeModel();
}
