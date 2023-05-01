import { Pipe, PipeTransform } from '@angular/core';
import { DateModel } from '@corbado/models/date.model';
import * as moment from 'moment';

@Pipe({
    name: 'currentTimeZone'
})

//Use Example : {{DateModel|currentTimeZone:'YYYY-MM-DD HH:mm:ss'}}
export class CurrentTimeZonePipe implements PipeTransform {
    transform(value:DateModel,format:string='YYYY-MM-DD HH:mm:ss'): string {
        
        const offset:number = new Date().getTimezoneOffset()/60;
        return moment(value.value,value.format).subtract(offset,'hour').fromNow();        
    }
}