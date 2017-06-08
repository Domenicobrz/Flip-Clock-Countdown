(function () {
    window.addEventListener('load', initCounters);
    // window.addEventListener('keypress', keypress);



    var DOMcounters = document.getElementsByClassName('counter');
    var Counters    = [];
    function initCounters() {
        var l = DOMcounters.length;

        for(var i = 0; i < l; i++) {
            Counters.push(new Counter(DOMcounters[i]));
        }
    }


    var then = 0;
    function updateCounters(now) {
        requestAnimationFrame(updateCounters);

        now *= 0.001;
        var deltatime = now - then;
        then = now;
        
        var l = Counters.length;

        for(var i = 0; i < l; i++) {
            Counters[i].update(deltatime);
        }
    } updateCounters();









    function Counter(DOMcounter) {
        var DateTo;
        var DateNow;
        var DateDiff;

        // container of the seconds elements, and so on
        var SecondsObj, MinutesObj, HoursObj, DaysObj;
        // array containing: [0] SecondsObj [1] minutesObj [2] hoursObj [3] daysObj
        var CounterObjs = [];

        var lastSec, lastMin, lastHour, lastDay;
        var currSec, currMin, currHour, currDay;
        // once we see we're now at sec 31, fire the animation. Simple as that. Any previous animation will need to be overridden.
        // update() will just check if it's time to fire the new animation.



        function computeDate() {
            if(DOMcounter.hasAttribute('date-to')) {
                DateTo  = new Date(DOMcounter.getAttribute('date-to'));
                DateNow = new Date();
                // DateDiff = new Date(DateTo.getTime() - DateNow.getTime());

                var x = DateTo.getTime();
                var y = DateNow.getTime();
                var diff = x - y;

                if(diff <= 0.0) {
                    return { sec: 0, min: 0, hr: 0, day: 0 };
                    // register/call your callback here
                }

                return {
                    sec: parseInt((diff / (1000)) % 60),
                    min: parseInt((diff / (60*1000)) % 60),
                    hr:  parseInt((diff / (3600*1000)) % 24),
                    day: parseInt(diff / (24*3600*1000))
                };
            } else {
                console.log('data-to attribute not found');
            }
        }


        function init() {
            var diff = computeDate();

            lastSec  = diff.sec;
            lastMin  = diff.min;
            lastHour = diff.hr;
            lastDay  = diff.day;

            /* creating DOM elements to append to parent */
            /* the html structure is as follow

                <div class="counterField counterSeconds">
                    <div class="cNext cBottom"> <span class="cbBaseline">31</span> </div>
                    <div class="cNext cTop"> 31 </div>
                    <div class="cCurrent cBottom"> <span class="cbBaseline">30</span> </div>
                    <div class="cCurrent cTop"> 30 </div>
                    <hr>
                </div>
             
            */

            var textValue  = [lastDay, lastHour, lastMin, lastSec], 
                labelValue = ['days', 'hours', 'min', 'sec'];
             
            for(var i = 0; i < 4; i++) {
                var counterField = document.createElement('div');
                counterField.className = "counterField";
        

                var cNextBottom  = document.createElement('div');
                cNextBottom.className = "cNext cBottom";
                var cNBSpan = document.createElement('span');
                cNBSpan.className = "cbBaseline";
                var cNBtextNode = document.createTextNode(textValue[i]);
                var cNBlabel   = document.createElement('span');
                cNBlabel.className = "counterLabel";                
                cNBlabel.innerHTML = labelValue[i];

                var cNextTop     = document.createElement('div');
                cNextTop.className = "cNext cTop";
                var cNTtextNode = document.createTextNode(textValue[i]);

                var cCurrentBottom  = document.createElement('div');
                cCurrentBottom.className = "cCurrent cBottom";     
                var cCBSpan = document.createElement('span');
                cCBSpan.className = "cbBaseline";
                var cCBshadow = document.createElement('div');
                cCBshadow.className = "counterBottomShadow";
                var cCBtextNode = document.createTextNode(textValue[i]);
                var cCBlabel   = document.createElement('span');
                cCBlabel.className = "counterLabel";                
                cCBlabel.innerHTML = labelValue[i];


                var cCurrentTop  = document.createElement('div');
                cCurrentTop.className = "cCurrent cTop";
                var cCTshadow = document.createElement('div');
                cCTshadow.className = "counterTopShadow";
                var cCTtextNode = document.createTextNode(textValue[i]);

                var counterHr = document.createElement('hr');


                // composing DOM parts
                counterField.appendChild(cNextBottom);
                counterField.appendChild(cNextTop);
                counterField.appendChild(cCurrentBottom);
                counterField.appendChild(cCurrentTop);
                counterField.appendChild(counterHr);

                cNextBottom.appendChild(cNBSpan);
                cNextBottom.appendChild(cNBlabel);
                cNBSpan.appendChild(cNBtextNode);

                cNextTop.appendChild(cNTtextNode);

                cCurrentBottom.appendChild(cCBSpan);
                cCurrentBottom.appendChild(cCBlabel);
                cCBSpan.appendChild(cCBtextNode);
                cCurrentBottom.appendChild(cCBshadow);

                cCurrentTop.appendChild(cCTtextNode);
                cCurrentTop.appendChild(cCTshadow);

                // appending to the DOMcounter
                DOMcounter.appendChild(counterField); 

                // saving text nodes references

                CounterObjs.push({
                    DOMContainer: counterField, 
                    animating: false,
                    animProgress: 0,

                    NB: cNextBottom,
                    NT: cNextTop,
                    CB: cCurrentBottom,
                    CT: cCurrentTop,

                    CTs: cCTshadow,
                    CBs: cCBshadow,

                    tnNB: cNBtextNode,
                    tnNT: cNTtextNode,
                    tnCB: cCBtextNode,
                    tnCT: cCTtextNode
                });
            }

            SecondsObj = CounterObjs[3];
            MinutesObj = CounterObjs[2];
            HoursObj   = CounterObjs[1];
            DaysObj    = CounterObjs[0];
        } init();



        function resetState(CounterObj, from, to) {
            CounterObj.animating = true;
            CounterObj.animProgress = 0;


            CounterObj.CTs.style.opacity = 0;
            CounterObj.CBs.style.opacity = 0;
            


            CounterObj.tnNB.nodeValue = String(to); 
            CounterObj.tnNT.nodeValue = String(to); 
            CounterObj.tnCB.nodeValue = String(from); 
            CounterObj.tnCT.nodeValue = String(from); 


            // to prevent pixel snatching
            CounterObj.CT.style.transform = 'translateZ(0px)';
            // CounterObj.CB.style.transform = 'translateZ(0px)';
            CounterObj.NB.style.transform = 'translateZ(0px)';
            CounterObj.NT.style.transform = 'translateZ(0px)'; 


            CounterObj.NB.style.zIndex = '1';
            CounterObj.NT.style.zIndex = '1';
            CounterObj.CB.style.zIndex = '1';
            CounterObj.CT.style.zIndex = '1';    
        }

        function animateCounterObj(CounterObj, deltatime) {        
            var t = CounterObj.animProgress;

            // normalize to make it last at most 0.7 seconds
            t = t / 0.7;
            t = t > 1 ? 1 : t;
            // hermite interpolation
            t = t * t * (3 - 2 * t);


            if(t >= 0.5) {
                CounterObj.NB.style.zIndex = '2';
                CounterObj.NT.style.zIndex = '2';
                CounterObj.CB.style.zIndex = '1';
                CounterObj.CT.style.zIndex = '1';            
            }

            // CounterObj.CB.style.transform = 'rotateX(0deg)';
            CounterObj.CT.style.transform = 'rotateX(' + Math.floor(-t * 180) + 'deg)';
            // CounterObj.NT.style.transform = 'rotateX(0deg)';
            CounterObj.NB.style.transform = 'rotateX(' + Math.floor(180 - t * 180) + 'deg)';


            CounterObj.CTs.style.opacity = Math.pow(t, 0.7) * 0.99;
            CounterObj.CBs.style.opacity = Math.pow(t, 0.7) * 0.99;
        

            CounterObj.animProgress += deltatime;
        }


        // external API
        this.update = function(deltatime) {
            var diff = computeDate();
            

            currSec = diff.sec;
            if(lastSec !== currSec) {
                resetState(SecondsObj, lastSec, lastSec === 0 ? 59 : lastSec - 1);
                lastSec = currSec;
            }

            currMin = diff.min;
            if(lastMin !== currMin) {
                resetState(MinutesObj, lastMin, lastMin === 0 ? 59 : lastMin - 1);
                lastMin = currMin;
            }

            currHour = diff.hr;
            if(lastHour !== currHour) {
                resetState(HoursObj, lastHour, lastHour === 0 ? 23 : lastHour - 1);
                lastHour = currHour;
            }

            currDay = diff.day;
            if(lastDay !== currDay) {
                resetState(DaysObj, lastDay, (lastDay - 1));
                lastDay = currDay;
            }





            for(var i = 0; i < 4; i++)
                if(CounterObjs[i].animating) animateCounterObj(CounterObjs[i], deltatime);       
        };
    }


    // function keypress(e) {

    //     var count = 0;
    //     var DOM = document.querySelector('.counterDays');
    //     var cTop = document.querySelector('.cCurrent.cTop');
    //     var cBot = document.querySelector('.cCurrent.cBottom');
    //     var nTop = document.querySelector('.cNext.cTop');
    //     var nBot = document.querySelector('.cNext.cBottom');

    //     setInterval(function(){
    //         if(count > 180) return;
    //         if(count >= 90) {
    //             nBot.style.zIndex = 2;
    //             cBot.style.zIndex = 1;
    //         }

    //         cTop.style.transform = 'rotateX(' + (-count) + 'deg)';
    //         nBot.style.transform = 'rotateX(' + (180 - count) + 'deg)';

    //         count += 1;
    //     }, 30);
    // }

})();