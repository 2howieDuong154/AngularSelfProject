import { Component, ElementRef, inject, signal, ViewChild, WritableSignal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormsModule } from '@angular/forms';
import { ProjectService } from '../../core/sevices/project-service';
import { IProject, IProjectEmployee, NewProjectModel } from '../../core/model/Interfaces/User.Model';
import { AsyncPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { EmployeeModel } from '../../core/model/classes/Employee.model';
import { Observable } from 'rxjs';
import { EmployeeService } from '../../core/sevices/employee-service';

@Component({
  imports: [ReactiveFormsModule, UpperCasePipe, AsyncPipe, DatePipe, FormsModule],
  selector: 'app-projects',
  styleUrl: './projects.css',
  templateUrl: './projects.html',
})
export class Projects {
  projectForm!: FormGroup;
  projectService = inject(ProjectService);
  projectLists = signal<IProject[]>([]);
  showProjectForm = signal(false);
  currentProjectId = signal(0);
  private readonly projectColors = ['#3b6380', '#987345', '#8a514e', '#4d766e', '#6b5b85'];
  employeeService = inject(EmployeeService);
  employeeList$: Observable<EmployeeModel[]> = new Observable<EmployeeModel[]>();
  projectEmployeeLists = signal<IProjectEmployee[]>([]);
  currentSelectedProjectEmployees: WritableSignal<IProjectEmployee[]> = signal([]);
  @ViewChild('employeeAssignmentModal') modalForm?: ElementRef<HTMLElement>;

  assignEmpObj: any = {
    "empProjectId": 0,
    "projectId": 0,
    "empId": 0,
    "assignedDate": "2026-08-27T09:07:52.631Z",
    "role": "string",
    "isActive": true
  }

  getProjectColor(projectName: string): string {
    const colorIndex = [...projectName].reduce(
      (total, character) => total + character.charCodeAt(0),
      0,
    ) % this.projectColors.length;

    return this.projectColors[colorIndex];
  }

  openProjectForm() {
    this.showProjectForm.set(true);
  }

  closeProjectForm() {
    this.showProjectForm.set(false);
  }

  removeProject(projectId: number) {
    this.projectLists.update((projects) =>
      projects.filter((project) => project.projectId !== projectId),
    );
  }

  initializeForm() {
    this.projectForm = new FormGroup({
      projectId: new FormControl(0),
      projectName: new FormControl(''),
      clientName: new FormControl(''),
      startDate: new FormControl(''),
      leadByEmpId: new FormControl(0),
      contactPerson: new FormControl(''),
      contactNo: new FormControl(''),
      emailId: new FormControl(''),
    });
  }

  constructor() {
    this.initializeForm();
    this.loadProjectEmployees();
    this.employeeList$ = this.employeeService.getAllEmployee();
  }

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getAllProjects().subscribe({
      // Logic to handle the loaded projects
      next: (projects: IProject[]) => {
        this.projectLists.set(projects);
        console.log('Loaded projects:', projects);
      },
      error: (error) => {
        console.error('Error loading projects:', error);
      },
    });
  }

  loadProjectEmployees() {
    this.projectService.getAllProjectEmployees().subscribe({
      next: (projectEmployees: IProjectEmployee[]) => {
        this.projectEmployeeLists.set(projectEmployees);
        console.log('Loaded project employees:', projectEmployees);
        if (this.currentProjectId() !== 0) {
          this.reloadEmployeeProject(this.currentProjectId());
        }
      },
      error: (error) => {
        console.error('Error loading project employees:', error);
      },
    });
  }

  addEmployeeToProject() {
    if (this.assignEmpObj) {
      this.projectService.addEmployeeToProject(this.assignEmpObj).subscribe({
        next: (response) => {
          console.log('Employee added to project successfully:', response);
          this.loadProjectEmployees();
          alert('Employee added to project successfully!');
        },
        error: (error) => {
          console.error('Error adding employee to project:', error);
        },
      });
      // Logic to add the employee to the project
      console.log('Adding employee to project:', this.assignEmpObj);
      // You can call a service method here to save the assignment
      // For example: this.projectService.assignEmployeeToProject(this.assignEmpObj).subscribe(...)
    } else {
      console.error('Employee ID and Project ID are required to assign an employee.');
    }
  }

  saveProject() {
    if (this.projectForm.valid) {
      const projectData: NewProjectModel = this.projectForm.value;
      this.projectService.createProject(projectData).subscribe({
        next: (response) => {
          console.log('Project saved successfully:', response);
          // Optionally, you can reset the form or perform other actions
          this.projectForm.reset();
          this.loadProjects(); // Reload the projects after saving
        },
        error: (error) => {
          console.error('Error saving project:', error);
        },
      });
    }
  }

  openEmpModal(projectId: number) {
    this.currentProjectId.set(projectId);
    this.assignEmpObj.projectId = projectId;
    this.reloadEmployeeProject(projectId);
    if (this.modalForm) {
      this.modalForm.nativeElement.showPopover();
    }
  }

   reloadEmployeeProject(projectId: number) {
      this.currentSelectedProjectEmployees.set(this.projectEmployeeLists().filter(
        (emp) => emp.projectId === projectId
      ));
    }

  closeModal() {
    if (this.modalForm) {
      this.modalForm.nativeElement.hidePopover();
    }
  }
}
