import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
providedIn: 'root'
})

export class ComParentChildService {

	private subjects: Subject<any>[] = [];

	publish(eventName: any) {
	  // ensure a subject for the event name exists
	  this.subjects[eventName] = this.subjects[eventName] || new Subject();

	  // publish event
	  this.subjects[eventName].next(null);
	}

	publishWithData(eventName: any, data: any) {
	  // ensure a subject for the event name exists
	  this.subjects[eventName] = this.subjects[eventName] || new Subject();

	  // publish event
	  this.subjects[eventName].next(data);
	}

	on(eventName: any): Observable<any> {
	  // ensure a subject for the event name exists
	  this.subjects[eventName] = this.subjects[eventName] || new Subject();

	  // return observable
	  return this.subjects[eventName].asObservable();
	}
}
