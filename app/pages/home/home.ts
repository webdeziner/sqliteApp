import {Component} from '@angular/core';
import {Platform, NavController, Storage, SqlStorage, Modal} from 'ionic-angular';
import {AddPage} from '../add/add';


@Component({
    templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
    private storage: any;
    public items: any;
    constructor(private platform: Platform, private navCtrl: NavController) {
        platform.ready().then(() => {
            console.log("Home ready");
            let options = {
                name: 'todo.db',
                iosDatabaseLocation: 'default'
            }
            this.storage = new Storage(SqlStorage, options);
            this.refresh();
        });
    }

    openModal(event) {
        let showModal = Modal.create(AddPage);
        showModal.onDismiss(data => {
            console.log("Do a refresh?");
            console.log(data);
            this.refresh();
        });
        this.navCtrl.present(showModal);
    }

    updateStatus(item) {
        let status = "no";
        if(item.done == 'no') {
            status = "yes";
        }
        this.storage.query("UPDATE todos SET done = ? WHERE id = ?", [status, item.id]).then((data) => {
            console.log(JSON.stringify(data.res));
            this.refresh();
        }, (error) => {
            console.log("Update error: "+ JSON.stringify(error.err));
        });
    }

    delete(item) {
        this.storage.query("DELETE FROM todos WHERE id = ?", [item.id]).then((data) => {
            console.log(JSON.stringify(data.res));
            this.refresh();
        }, (error) => {
            console.log("Delete error: "+ JSON.stringify(error.err));
        });
    }

    refresh() {
        this.storage.query("SELECT * FROM todos").then((data) => {
            this.items = [];
            if(data.res.rows.length > 0) {

                for(var i = 0; i < data.res.rows.length; i++) {
                    this.items.push({
                        id: data.res.rows.item(i).id,
                        title: data.res.rows.item(i).title,
                        done: data.res.rows.item(i).done
                    });
                }
            }

        }, (error) => {
            console.log("Refresh error: " + JSON.stringify(error.err));
        });
    }
}
