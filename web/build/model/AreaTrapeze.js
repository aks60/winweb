
import {AreaSimple} from './AreaSimple.js';

export class AreaTrapeze extends AreaSimple {

    constructor() {
        try {
        alrt('new AreaTrapeze');
        } catch (e) {
            errorLog('Error: AreaSimple.constructor() ' + e.message);
        }        
    }

    setLocation() {
        try {
            //console.log('Exec: AreaTrapeze.setLocation()');
        } catch (e) {
            errorLog('Error: AreaTrapeze.setLocation() ' + e.message);
        }
    }
}

