
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
            console.log('Exec: AreaDoor.setLocation()');
        } catch (e) {
            errorLog('Error: AreaDoor.setLocation() ' + e.message);
        }
    }
}


