import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AuthorizationService } from './authorization.service';
import { JwtHelper } from 'angular2-jwt';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  decodedToken: any;
  jwtHelper: JwtHelper = new JwtHelper();
  userPermissions: any;
  reqRoute: any;

  constructor(
    private router: Router,
    private authorizationService: AuthorizationService
  ) {}

  // implementing canActivate for authorization guard
  canActivate(route, state: RouterStateSnapshot) {
    let routeExpectedRoles = route.data;
    let currentUserRoles = this.authorizationService.getRole();

    // If user is not logged in
    if (currentUserRoles == null) {
      this.router.navigate(['/auth']);
      return;
    }

    let myRoles = currentUserRoles;
    let allowedRoles = routeExpectedRoles.expectedRoles;

    // Check if current user has any role that are allowed to access the requested route
    let authorize = this.CheckUserPermissions(myRoles, allowedRoles);

    // If the current user doesn't have any valid roles to access the route
    if (!authorize) {
      this.router.navigate(['/forbidden']);
    }

    return authorize;
  }

  // check user permissions
  CheckUserPermissions(myRoles, allowedRoles) {
    for (var myRole of myRoles) {
      for (var allowedRole of allowedRoles) {
        if (RegExp(allowedRole).test(myRole)) return true;
      }
    }
    return false;
  }
}
