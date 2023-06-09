import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NotificationsService } from '../notifications.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, OnDestroy {

  userIsAuthenticated: boolean;
  username: string
  userId: string
  notificationCount: number = null;
  notificationsSubscription: Subscription;

  constructor(private authService: AuthService, private notificationService: NotificationsService) { }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.username = this.authService.getUsername();

    this.authService.getAuthStatusListener().subscribe({
      next: (value) => {
        this.userIsAuthenticated = value
      },
      error: (err) => {
        console.log(err);
      }
    })
    this.notificationService.getNotifications(this.username);
    this.notificationsSubscription = this.notificationService.getNotificationsUpdateListener().subscribe({
      next: (result: any) => {
        if (result) {
          this.notificationCount = result.filter(n => (n.senderId.username != this.username && n.read == false)).length;
        } else {
          this.notificationCount = 0;
        }
      }
    });

  }

  ngOnDestroy(): void {
    this.notificationsSubscription.unsubscribe();
  }


}
