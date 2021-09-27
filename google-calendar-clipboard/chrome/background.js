/*
 * Installed event
 */
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'copy-day',
        title: 'Copy',
        contexts: [
            'all'
        ]
    });
});

/*
 * Icon event
 */
chrome.action.onClicked.addListener((tab) => {
    //console.log(tab);
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: CopyDay
    },
    () => {
        //console.log('done')
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            func: Loading
        },
        () => {
            //console.log('done')
        });
    });
});

/*
 * Menu event
 */
chrome.contextMenus.onClicked.addListener((info, tabs) => {
    //console.log(info);
    //console.log(tabs);
    const tabId = tabs.id;
    chrome.scripting.executeScript({
        target: {tabId: tabId},
        func: CopyDay
    },
    () => {
        //console.log('done')
        chrome.scripting.executeScript({
            target: {tabId: tabId},
            func: Loading
        },
        () => {
            //console.log('done')
        });
    });
});

/*
 * CopyDay
 */
function CopyDay() {
    //console.log('CopyDay');
    chrome.storage.local.get('name', (items) => {
        // Get from element if not set locally.
        const name = items.name == void(0) ? document.getElementsByClassName("gb_lb gb_mb")[0].textContent : items.name;
        
        let list = [];
        const calendar = document.getElementsByClassName('YvjgZe')[0];
        const schedules = calendar.getElementsByClassName('ynRLnc')
        for (let i = 0; i < schedules.length; i++) {
            let text = schedules[i].textContent;
            if (text.indexOf(name + '、') != -1) {
                q = text.split('、');
                list.push(q[1]);
            }
        }

        //console.log(list);

        var clipboardText = list.join('\r\n');
        if(navigator.clipboard == undefined) {
            window.clipboardData.setData('Text', clipboardText);
        } else {
            navigator.clipboard.writeText(clipboardText);
        }
    });
}

/*
 * Loading
 */
function Loading() {
    // Default
    var set = {
        message_class: 'splashmsg default',
        fadein_sec: 0.1,
        wait_sec: 0.5,
        fadeout_sec: 1.5,
        opacity: 0.9,
        trans_in: 'ease-in',
        trans_out: 'ease-out',
        outer_style: 'top: 0px;left: 0px;position: fixed;z-index: 1000;width: 100%;height: 100%;',
        message_style: 'padding:0.5em;font-size:4em;color:white;background-color:gray; position: absolute;top: 50%; left: 50%;transform: translateY(-50%) translateX(-50%);-webkit-transform: translateY(-50%) translateX(-50%);',
        style_id: 'append_splash_msg_style',
        outer_id: 'append_splash_msg',
        message_id: 'append_splash_msg_inner',
        on_splash_vanished: null // callback function
    };

    // Style
    if(!document.getElementById(set.style_id)) {
        var style = document.createElement('style');
        style.id = set.style_id;
        style.innerHTML = 
        "#"+set.outer_id+" { "+set.outer_style+" } " +
        "#"+set.outer_id+" > #"+set.message_id+" {opacity: 0;transition: opacity "+set.fadeout_sec+"s "+set.trans_out+";-webkit-transition: opacity "+set.fadeout_sec+"s "+set.trans_out+";} " +
        "#"+set.outer_id+".show > #"+set.message_id+" {opacity: "+set.opacity+";transition: opacity "+set.fadein_sec+"s "+set.trans_in+";-webkit-transition: opacity "+set.fadein_sec+"s "+set.trans_in+";}" +
        "#"+set.message_id+" { "+set.message_style+" } ";
        document.body.appendChild(style);
    }

    //Element (Outer, Inner)
    if((e = document.getElementById(set.outer_id))) {
        e.parentNode.removeChild(e);
        if(set.on_splash_vanished) {
            set.on_splash_vanished();
        }
    }
    var splash = document.createElement('div');
    splash.id = set.outer_id;
    splash.onclick = function() {
        if((e = document.getElementById(set.outer_id))) {
            e.parentNode.removeChild(e);
        }
        if(set.on_splash_vanished) {
            set.on_splash_vanished();
        }
    };
    splash.innerHTML = '<div id="'+set.message_id+'" class="'+set.message_class+'">Copy completed.</div>';
    document.body.appendChild(splash);
    
    //Timer
    setTimeout(function() {
        if(splash) splash.classList.add('show');
    },0);
    setTimeout(function() {
        if(splash) splash.classList.remove('show');
    },set.wait_sec*1000);
    setTimeout(function() {
        if(splash && splash.parentNode) {
            splash.parentNode.removeChild(splash);
        }
        if(set.on_splash_vanished) {
            set.on_splash_vanished();
        }
    },(set.fadeout_sec+set.wait_sec)*1000);
}
