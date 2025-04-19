import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRoute, RouterStateSnapshot, Router, UrlTree, ActivatedRouteSnapshot, GuardResult, MaybeAsync } from "@angular/router";
import { merge } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class ParamsGuard implements CanActivate {

    constructor(private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
        const url = state.url.split('?')[0];
        const queryParams = route.queryParams;
        const mode = queryParams['mode']

        const isHome = url === '/'

        if (mode === undefined && !isHome){
            return this.router.createUrlTree([url], {
                queryParams: { mode:'game' },
                queryParamsHandling: 'merge',
                preserveFragment: true,
            })
        }
        return true
    }
}