import {Component} from '@angular/core';
import {NavController, ViewController, Platform, Storage, SqlStorage, Modal} from 'ionic-angular';
import {FormBuilder, Validators} from '@angular/common';

@Component({
    templateUrl: 'build/pages/add/add.html'
})
export class AddPage {
    private storage: any;
    public addForm: any;
    constructor(private platform: Platform, private viewCtrl: ViewController, private formHandler: FormBuilder) {
        this.storage = null;
        this.addForm = formHandler.group({
            title: ["", Validators.required]
        });

        platform.ready().then(() => {
            console.log("Add ready");
            let options = {
                name: 'todo.db'
                //iosDatabaseLocation: 'default'
            };
            this.storage = new Storage(SqlStorage, options);
        });
    }

    add(event) {
        let title = this.addForm.value.title;
        let insert_id = 0;
        //console.log("Title: ", title);
        this.storage.query("INSERT INTO todos (title, done) VALUES (?, ?)", [title, 'no']).then((data) => {
            console.log(JSON.stringify(data.res));
            insert_id = data.res.rows.insertId;
        }, (error) => {
            console.log("Add error: "+ JSON.stringify(error.err));
        });

        this.viewCtrl.dismiss({id: insert_id});
        event.preventDefault();
    }

    close(event) {
        this.viewCtrl.dismiss();
    }
}
