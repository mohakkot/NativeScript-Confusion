import { Component, OnInit } from "@angular/core";
import { Page } from 'ui/page';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { getString, setString } from "application-settings";
import { RouterExtensions } from 'nativescript-angular/router';
import * as camera from 'nativescript-camera';
import * as imagepicker from 'nativescript-imagepicker';
import { Image } from 'ui/Image';

@Component({
    moduleId: module.id,
    templateUrl: "./userauth.component.html"
})

export class UserAuthComponent implements OnInit{
    loginForm : FormGroup;
    registerForm: FormGroup;
    tabSelectedIndex: number= 0;
    previmage : Image;

    constructor(private page: Page,
    private routerExtensions: RouterExtensions,
    private formBuilder: FormBuilder){

        this.loginForm = this.formBuilder.group({
            userName: [getString('username',''), Validators.required],
            password: [getString('password',''), Validators.required]
        });

        this.registerForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            userName: ['', Validators.required],
            password: ['', Validators.required],
            telnum: ['', Validators.required],
            email: ['', Validators.required]
        });
    }
    ngOnInit(){

    }

    takePicture(){
        let isAvailable = camera.isAvailable();
        if(isAvailable){
            camera.requestPermissions();
            var options = { width: 100, height: 100, keepAspectRatio: false, saveToGallery: true};
            camera.takePicture(options)
            .then((selection)=> {
                let image = <Image>this.page.getViewById<Image>('myPicture');
                image.src=selection
            })
            .catch((err)=>console.log('Error ->' + err.message));
        }
    }

    getFromLibrary(){

        let context = imagepicker.create({
            mode: "single"
        })
        let image = <Image>this.page.getViewById<Image>('myPicture');

        context.authorize().then(() => {
            return context.present();
        })
        .then((selection) => {
            selection.forEach(function(selected){
                selected.getImage().then((imagesource) => { 
                    image.src=imagesource;
                })
            })
        })
        .catch((err)=>console.log('Error ->' + err.message));
    }

    register(){
        
        this.tabSelectedIndex = 1;
    }

    onLoginSubmit(){
        console.log(JSON.stringify(this.loginForm.value));
        setString("userName", this.loginForm.get("userName").value);
        setString("password", this.loginForm.get("password").value);
        this.routerExtensions.navigate(["/home"], { clearHistory : true});
    }

    onRegisterSubmit(){
        console.log(JSON.stringify(this.registerForm.value));
        setString("userName", this.registerForm.get("userName").value);
        setString("password", this.registerForm.get("password").value);
        this.tabSelectedIndex = 0;
        this.loginForm.patchValue({
            'userName': this.registerForm.get('userName').value,
            'password': this.registerForm.get('password').value
        });
    }
}