import { Component, OnInit, Inject, ChangeDetectorRef } from "@angular/core";
import { TNSFontIconService } from 'nativescript-ngx-fonticon';
import * as email from "nativescript-email";
import * as phone from "nativescript-phone";

import { DrawerPage } from '../shared/drawer/drawer.page';

@Component({
    selector: 'app-contact',
    moduleId: module.id,
    templateUrl: './contact.component.html'
})

export class ContactComponent extends DrawerPage {
    
    constructor(private changeDetectorRef: ChangeDetectorRef,
        private fonticon: TNSFontIconService,
        @Inject('BaseURL') private BaseURL){ 
            super(changeDetectorRef);
        }
    
    sendEmail(){
        email.available()
        .then((avail: boolean) => {
            if(avail){
                email.compose({
                    to: ['confusion@food.net'],
                    subject: '[ConFusion]: Query',
                    body: 'Dear Sir/Madam:'
                });
            }
            else{
                console.log("No Email Configured")
            }
        })
    }

    callRestaurant(){
        phone.dial('852-123-4567', true);  
    }

}