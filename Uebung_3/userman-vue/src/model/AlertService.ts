export class AlertService {
    alertList: string[] = [];

    constructor() {
    }

    deleteAutomatic() {
        setTimeout(() => {
            this.alertList.splice(0, 1);
        }, 5000);
    }

    add(text: string) {
        this.alertList.push(text);
        this.deleteAutomatic();
    }

    delete_(index: number) {
        this.alertList.splice(index, 1);
    }
}
