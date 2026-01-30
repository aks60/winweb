
export class Timer {
    
    constructor(callback, delay) {
        this.callback = callback;
        this.remaining = delay;
        this.timerId = null;
        this.start = null;

        this.resume();
    }

    pause() {
        window.clearTimeout(this.timerId);
        this.timerId = null;
        this.remaining -= Date.now() - this.start; // Calculate elapsed time
    }

    resume() {
        if (this.timerId) {
            return;
        }
        this.start = Date.now();
        // Use setTimeout to call the callback after the remaining time
        this.timerId = window.setTimeout(this.callback, this.remaining);
    }

    stop() {
        window.clearTimeout(this.timerId);
        this.timerId = null;
        this.remaining = 0;
    }
    
    test() {
        alert('exec common.Timer');
    }
}
/*
   // Usage Example:
   function sayHello() {
     console.log("Hello after the delay!");
   }
 
   const myTimer = new Timer(sayHello, 3000); // 3 seconds
   // myTimer.pause(); // Can be paused later
   // myTimer.resume(); // Can be resumed
 */


