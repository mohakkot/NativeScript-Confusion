import { Component, OnInit, ChangeDetectorRef, ViewContainerRef } from "@angular/core";
import { DrawerPage } from '../shared/drawer/drawer.page';
import {TextField } from "ui/text-field";
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Switch } from 'ui/switch';
import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';
import { ReservationModalComponent } from '../reservationmodal/reservationmodal.component';

@Component({
    selector: 'app-reservation',
    moduleId: module.id,
    templateUrl: './reservation.component.html'
})

export class ReservationComponent extends DrawerPage implements OnInit{

    reservation: FormGroup;

    constructor(private changeDetectorRef: ChangeDetectorRef,
                private formBuilder: FormBuilder,
                private modalService : ModalDialogService,
                private vcRef: ViewContainerRef){ 
            super(changeDetectorRef);

            this.reservation = this.formBuilder.group({
                guests : 3,
                smoking: false,
                dateTime: ['', Validators.required]
            });
        }
    ngOnInit(){

    }

    onGuestChange(args){
        let textfield = <TextField>args.object;
        this.reservation.patchValue({ guests : textfield.text});
    }

    onSmokingChecked(args){
        let smokingSwitch = <Switch>args.object;
        if(smokingSwitch.checked) {
            this.reservation.patchValue({smoking: true});
        }
        else{
            this.reservation.patchValue({smoking: false});
        }
    }

    onDateTimeChange(args){
        let textfield = <TextField>args.object;
        this.reservation.patchValue({dateTime: textfield.text});
    }

    onSubmit() {
        console.log(JSON.stringify(this.reservation.value));
    }

    createModalView(args){

        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: args,
            fullscreen: false
        };

        this.modalService.showModal(ReservationModalComponent, options)
            .then((result: any) =>{
                if(args==='guest') {
                    this.reservation.patchValue({guests: result});
                }
                else if(args === 'date-time'){
                    this.reservation.patchValue({dateTime: result});
                }
            });
        
    }
}
