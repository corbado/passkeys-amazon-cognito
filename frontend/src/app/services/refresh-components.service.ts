import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RefreshComponentsService {
    private subjectSettings = new Subject<any>();
    private subjectContent = new Subject<any>();



    sendSettingsUpdate(user: object) { //the component that wants to update something, calls this fn
        this.subjectSettings.next(user);
    }

    getSettingsUpdate(): Observable<any> { //the receiver component calls this function 
        return this.subjectSettings.asObservable();
    }


    sendContentsUpdate(value: boolean) {
        if (value) //the component that wants to update something, calls this fn
            this.subjectContent.next();
    }

    getContentsUpdate(): Observable<any> { //the receiver component calls this function 
        return this.subjectContent.asObservable();
    }


}