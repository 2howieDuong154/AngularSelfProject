import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ProjectService } from '../../core/sevices/project-service';
import { IProject, NewProjectModel } from '../../core/model/Interfaces/User.Model';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { EmployeeModel } from '../../core/model/classes/Employee.model';
import { Observable } from 'rxjs';
import { EmployeeService } from '../../core/sevices/employee-service';

@Component({
  imports: [ReactiveFormsModule, UpperCasePipe, AsyncPipe],
  selector: 'app-projects',
  styleUrl: './projects.css',
  templateUrl: './projects.html',
})
export class Projects {
  projectForm!: FormGroup;
  projectService = inject(ProjectService);
  projectLists = signal<IProject[]>([]);
  showProjectForm = signal(false);
  private readonly projectColors = ['#3b6380', '#987345', '#8a514e', '#4d766e', '#6b5b85'];
  employeeService = inject(EmployeeService);
  employeeList$: Observable<EmployeeModel[]> = new Observable<EmployeeModel[]>();

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
}
