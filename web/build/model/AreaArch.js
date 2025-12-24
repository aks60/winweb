
import {AreaSimple} from './AreaSimple.js';

export class AreaArch extends AreaSimple {

    constructor() {
        try {
            alrt('new AreaArch');
        } catch (e) {
            errorLog('Error: AreaArch.constructor() ' + e.message);
        }
    }
    
    setLocation() {
        try {
            console.log('Exec: AreaArch.setLocation()');
        } catch (e) {
            errorLog('Error: AreaArch.setLocation() ' + e.message);
        }
    }    
}

