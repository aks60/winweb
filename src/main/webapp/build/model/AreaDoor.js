
import {AreaSimple} from './AreaSimple.js';

export class AreaDoor extends AreaSimple {

    constructor() {
        try {
            alrt('new AreaDoor');
        } catch (e) {
            console.error(e.message);
        }
    }

    setLocation() {
        try {
            super.paint();
        } catch (e) {
            console.error(e.message);
        }
    }
}


