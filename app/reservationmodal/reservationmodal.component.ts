import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { DatePicker } from 'ui/date-picker'; 
import { TimePicker } from 'ui/time-picker';
import { ListPicker } from 'ui/List-Picker';
import { Page } from 'ui/page';

@Component({
    moduleId: module.id,
    templateUrl:'./reservationmodal.component.html'
})

export class ReservationModalComponent implements OnInit{

    guestArray = [1,2,3,4,5,6];
    guests: number;
    isDateTime : boolean=false;

    constructor(private params: ModalDialogParams, private page:Page){
        if(params.context ==="guest"){
            this.isDateTime=false;
        }   
        else if(params.context==='date-time'){
            this.isDateTime = true;
        }
    }

    ngOnInit(){
        if(this.isDateTime) {
            let datePicker: DatePicker = <DatePicker> this.page.getViewById<DatePicker>('datePicker');
            let currentDate: Date = new Date();
            datePicker.year = currentDate.getFullYear();
            datePicker.month = currentDate.getMonth();
            datePicker.day = currentDate.getDate();
            datePicker.minDate = currentDate;
            datePicker.maxDate = new Date(2020, 08,31);

            let timePicker: TimePicker = <TimePicker> this.page.getViewById<TimePicker>('timePicker');     
            timePicker.hour = currentDate.getHours();
            timePicker.minute = currentDate.getMinutes();
        }
    }

    public submit(){
        if(this.isDateTime) {
            let datePicker: DatePicker = <DatePicker> this.page.getViewById<DatePicker>('datePicker');
            let selectedDate = datePicker.date;
            let timePicker: TimePicker = <TimePicker> this.page.getViewById<TimePicker>('timePicker');     
            let selectedTime = timePicker.time;
            let reserveTime = new Date( selectedDate.getFullYear(),
                                        selectedDate.getMonth(),
                                        selectedDate.getDate(),
                                        selectedTime.getHours(),
                                        selectedTime.getMinutes());
            this.params.closeCallback(reserveTime.toISOString());
        }
        else{
            let listpicker = <ListPicker> this.page.getViewById<ListPicker>('guestPicker');
            this.params.closeCallback(this.guestArray[listpicker.selectedIndex]);
        }
    }
}