
import {AreaSimple} from './AreaSimple.js';

export class AreaDoor extends AreaSimple {

    constructor() {
        try {
            alrt('new AreaDoor');
        } catch (e) {
            errorLog('Error: AreaDoor.constructor() ' + e.message);
        }
    }

    setLocation() {
        try {
            super.paint();
        } catch (e) {
            errorLog('Error: AreaDoor.setLocation() ' + e.message);
        }
    }
}


