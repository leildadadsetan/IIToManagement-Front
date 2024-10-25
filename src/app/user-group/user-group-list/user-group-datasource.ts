import { DataSource } from '@angular/cdk/table';
import { HttpResponse } from '@angular/common/http';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { UserGroup } from '@core/domain-classes/user-group';
import { UserGroupResource } from '@core/domain-classes/user-group-resource';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { UserGroupService } from '../user-group.service';

export class UserGroupDataSource implements DataSource<UserGroup> {
    private userGroupSubject = new BehaviorSubject<UserGroup[]>([]);
    private responseHeaderSubject = new BehaviorSubject<ResponseHeader>(null);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();
    private _count: number = 0;
    sub$: Subscription;

    public get count(): number {
        return this._count;
    }

    public responseHeaderSubject$ = this.responseHeaderSubject.asObservable();

    constructor(private userGroupService: UserGroupService) {
      this.sub$= new Subscription();
    }

    connect(): Observable<UserGroup[]> {
        return this.userGroupSubject.asObservable();
    }

    disconnect(): void {
        this.userGroupSubject.complete();
        this.loadingSubject.complete();
        this.sub$.unsubscribe();
    }

    loadUserGroups(userGroupResource: UserGroupResource) {
        this.loadingSubject.next(true);
        this.sub$ = this.userGroupService.getUserGroups(userGroupResource).pipe(
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        )
        .subscribe((resp: HttpResponse<UserGroup[]>) => {
            // Accessing the headers
            const paginationHeader = resp.headers.get('pagination');
            
            // If the paginationHeader exists and is a JSON string, parse it
            let paginationParam;
            if (paginationHeader) {
                try {
                    paginationParam = JSON.parse(paginationHeader);
                } catch (e) {
                    // Handle the case where it's not valid JSON (if necessary)
                    console.error('Failed to parse pagination header:', e);
                    paginationParam = {};
                }
            } else {
                paginationParam = {}; // Fallback if no header is present
            }
    
            // Assuming 'paginationParam' contains a property 'totalItems' which sets the count
            this._count = paginationParam.totalItems || 0;
    
            // Set the user groups from the response body
            this.userGroupSubject.next(resp.body || []);
        });
    }
}
