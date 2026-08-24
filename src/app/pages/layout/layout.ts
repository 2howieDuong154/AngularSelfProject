import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { IUser } from '../../core/model/Interfaces/User.Model';
import { GlobalConstants } from '../../core/constants/global.constant';

@Component({
  imports: [RouterLink, RouterOutlet],
  selector: 'app-layout',
  styleUrl: './layout.css',
  templateUrl: './layout.html',
})
export class Layout {
loggedUserData!: IUser;
router: any = inject(Router);

constructor() {
  const userData = localStorage.getItem(GlobalConstants.LOGIN_LOCAL_KEY);
  if (userData) {
    this.loggedUserData = JSON.parse(userData);
  }
}
onLogout() {
  localStorage.removeItem(GlobalConstants.LOGIN_LOCAL_KEY);
  this.router.navigateByUrl('login');
}

}
