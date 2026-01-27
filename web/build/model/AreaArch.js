
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
            super.paint();
        } catch (e) {
            errorLog('Error: AreaArch.setLocation() ' + e.message);
        }
    }
}

